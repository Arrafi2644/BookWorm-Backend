import httpStatus from 'http-status-codes';
import { IBook } from "./book.interface";
import AppError from '../../errorHelpers/appError';
import { Book } from './book.model';
import { Genre } from '../genre/genre.model';
import { Shelf } from "../shelf/shelf.model";
import { Review } from "../review/review.model";
import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { QueryBuilder } from '../../utils/QueryBuilder';
import { bookSearchableFields } from './book.constants';

const createBook = async (payload: Partial<IBook>) => {
    const { genre } = payload;

    // Check if genre exists
    const isExistGenre = await Genre.findById(genre);
    if (!isExistGenre) {
        throw new AppError(httpStatus.NOT_FOUND, "Genre not found");
    }

    const book = await Book.create(payload);

    // Populate genre for response
    await book.populate("genre");

    return book;
};

const getAllBooks = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(
        Book.find().populate("genre", "name description"),
        query
    );
    
    const booksData = queryBuilder
        .filter()
        .search(bookSearchableFields)
        .sort()
        .fields()
        .paginate();

    const [data, meta] = await Promise.all([
        booksData.build(),
        queryBuilder.getMeta()
    ]);

    return {
        data,
        meta
    };
};

const getSingleBook = async (id: string) => {
    const book = await Book.findById(id).populate("genre", "name description");
    if (!book) {
        throw new AppError(httpStatus.NOT_FOUND, "Book Not Found");
    }
    return {
        data: book,
    };
};

const updateBook = async (id: string, payload: Partial<IBook>) => {
    const existingBook = await Book.findById(id);
    if (!existingBook) {
        throw new AppError(httpStatus.NOT_FOUND, "Book not found");
    }

    // If genre is being updated, check if it exists
    if (payload.genre) {
        const isExistGenre = await Genre.findById(payload.genre);
        if (!isExistGenre) {
            throw new AppError(httpStatus.NOT_FOUND, "Genre not found");
        }
    }

    const updatedBook = await Book.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    }).populate("genre", "name description");

    return updatedBook;
};

const deleteBook = async (id: string) => {
    const book = await Book.findById(id);
    if (!book) {
        throw new AppError(httpStatus.NOT_FOUND, "Book Not Found");
    }

    await Book.findByIdAndDelete(id);

    return {
        data: null,
    };
};


type RecommendationReason = {
    genreReason?: string;
    popularityReason?: string;
};

export type RecommendedBook = {
    book: IBook & { _id: Types.ObjectId };
    averageRating: number;
    reviewCount: number;
    reason: RecommendationReason;
};

const getPersonalizedRecommendations = async (
    decodedToken: JwtPayload,
    limit = 18
): Promise<RecommendedBook[]> => {
    const userId = new Types.ObjectId(decodedToken.userId);

    // 1. Find all books on any shelf for this user (to avoid recommending them again)
    const userShelves = await Shelf.find({ userId });
    const userBookIds = userShelves.map((shelf) => shelf.bookId.toString());

    // 2. Find books on the "read" shelf to infer preferred genres
    const readShelves = userShelves.filter((shelf) => shelf.status === "read");

    // If the user has enough read history, build personalized recommendations
    if (readShelves.length >= 3) {
        const readBookIds = readShelves.map((shelf) => shelf.bookId);

        // 2a. Determine most common genres from user's read books
        const genreStats = await Book.aggregate([
            {
                $match: {
                    _id: { $in: readBookIds },
                },
            },
            {
                $group: {
                    _id: "$genre",
                    readCount: { $sum: 1 },
                },
            },
            {
                $sort: { readCount: -1 },
            },
            {
                $limit: 3,
            },
        ]);

        const preferredGenreIds = genreStats.map((g) => g._id);

        // 2b. Aggregate books in preferred genres that the user has not shelved yet,
        // along with global approved review stats
        const personalizedBooks = await Review.aggregate([
            {
                $match: {
                    status: "approved",
                },
            },
            {
                $group: {
                    _id: "$bookId",
                    averageRating: { $avg: "$rating" },
                    reviewCount: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "book",
                },
            },
            {
                $unwind: "$book",
            },
            {
                $match: {
                    "book.genre": { $in: preferredGenreIds },
                    "book._id": { $nin: userBookIds.map((id) => new Types.ObjectId(id)) },
                },
            },
            {
                $sort: {
                    averageRating: -1,
                    reviewCount: -1,
                },
            },
            {
                $limit: limit,
            },
            {
                $lookup: {
                    from: "genres",
                    localField: "book.genre",
                    foreignField: "_id",
                    as: "genre",
                },
            },
            {
                $unwind: "$genre",
            },
        ]);

        // Map results to strongly typed RecommendedBook objects with reasons
        const recommendations: RecommendedBook[] = personalizedBooks.map((item) => {
            const genreStat = genreStats.find((g) => g._id.toString() === item.book.genre.toString());

            const reason: RecommendationReason = {
                genreReason: genreStat
                    ? `Matches your preference for ${item.genre.name} (${genreStat.readCount} book(s) read).`
                    : undefined,
                popularityReason:
                    item.averageRating && item.reviewCount
                        ? `Highly rated by the community (${item.averageRating.toFixed(
                              1
                          )} from ${item.reviewCount} review(s)).`
                        : undefined,
            };

            return {
                book: item.book,
                averageRating: item.averageRating ?? 0,
                reviewCount: item.reviewCount ?? 0,
                reason,
            };
        });

        if (recommendations.length > 0) {
            return recommendations;
        }
        // If no books were found in preferred genres, fall back to popular/random
    }

    // 3. Fallback: user has low history or no personalized matches.
    //    Show popular books (by approved reviews) + a few random ones.

    const popularBooks = await Review.aggregate([
        {
            $match: {
                status: "approved",
            },
        },
        {
            $group: {
                _id: "$bookId",
                averageRating: { $avg: "$rating" },
                reviewCount: { $sum: 1 },
            },
        },
        {
            $sort: {
                averageRating: -1,
                reviewCount: -1,
            },
        },
        {
            $limit: 10,
        },
        {
            $lookup: {
                from: "books",
                localField: "_id",
                foreignField: "_id",
                as: "book",
            },
        },
        {
            $unwind: "$book",
        },
        {
            $lookup: {
                from: "genres",
                localField: "book.genre",
                foreignField: "_id",
                as: "genre",
            },
        },
        {
            $unwind: "$genre",
        },
        {
            $match: {
                "book._id": { $nin: userBookIds.map((id) => new Types.ObjectId(id)) },
            },
        },
    ]);

    const popularRecommendations: RecommendedBook[] = popularBooks.map((item) => ({
        book: item.book,
        averageRating: item.averageRating ?? 0,
        reviewCount: item.reviewCount ?? 0,
        reason: {
            popularityReason: `Popular choice: average rating ${item.averageRating?.toFixed(
                1
            )} from ${item.reviewCount} review(s).`,
        },
    }));

    let remaining = limit - popularRecommendations.length;

    // If we still need more, fetch some random books that the user hasn't shelved yet
    let randomRecommendations: RecommendedBook[] = [];

    if (remaining > 0) {
        const randomBooks = await Book.aggregate([
            {
                $match: {
                    _id: { $nin: userBookIds.map((id) => new Types.ObjectId(id)) },
                },
            },
            { $sample: { size: remaining } },
            {
                $lookup: {
                    from: "genres",
                    localField: "genre",
                    foreignField: "_id",
                    as: "genre",
                },
            },
            {
                $unwind: "$genre",
            },
        ]);

        randomRecommendations = randomBooks.map((book) => ({
            book,
            averageRating: 0,
            reviewCount: 0,
            reason: {
                popularityReason: "Discover something new: randomly picked for variety.",
            },
        }));
    }

    return [...popularRecommendations, ...randomRecommendations].slice(0, limit);
};

export const BookServices = {
    createBook,
    getAllBooks,
    getSingleBook,
    updateBook,
    deleteBook,
    getPersonalizedRecommendations,
};
