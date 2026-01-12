import { Book } from "../book/book.model";
import { User } from "../user/user.model";
import { Review } from "../review/review.model";
import { Shelf } from "../shelf/shelf.model";
import { Genre } from "../genre/genre.model";
import { Tutorial } from "../tutorial/tutorial.model";

const getAdminDashboardAnalytics = async () => {
    const [
        totalUsers,
        totalBooks,
        totalGenres,
        totalTutorials,
        totalReviews,
        pendingReviews,
        approvedReviews,
        totalShelves,
        wantShelves,
        readingShelves,
        readShelves,
        booksPerGenre,
        topRatedBooks,
        popularCategories,
    ] = await Promise.all([
        User.countDocuments(),
        Book.countDocuments(),
        Genre.countDocuments(),
        Tutorial.countDocuments(),
        Review.countDocuments(),
        Review.countDocuments({ status: "pending" }),
        Review.countDocuments({ status: "approved" }),
        Shelf.countDocuments(),
        Shelf.countDocuments({ status: "want" }),
        Shelf.countDocuments({ status: "reading" }),
        Shelf.countDocuments({ status: "read" }),
        Book.aggregate([
            {
                $group: {
                    _id: "$genre",
                    bookCount: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: "genres",
                    localField: "_id",
                    foreignField: "_id",
                    as: "genre",
                },
            },
            { $unwind: "$genre" },
            {
                $project: {
                    _id: 0,
                    genreId: "$genre._id",
                    genreName: "$genre.name",
                    bookCount: 1,
                },
            },
        ]),
        // Top rated books - aggregate approved reviews, calculate average rating
        Review.aggregate([
            { $match: { status: "approved" } },
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
            { $unwind: "$book" },
            {
                $lookup: {
                    from: "genres",
                    localField: "book.genre",
                    foreignField: "_id",
                    as: "genre",
                },
            },
            { $unwind: { path: "$genre", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 0,
                    bookId: "$book._id",
                    title: "$book.title",
                    author: "$book.author",
                    coverImage: "$book.coverImage",
                    genre: {
                        _id: "$genre._id",
                        name: "$genre.name",
                    },
                    averageRating: { $round: ["$averageRating", 2] },
                    reviewCount: 1,
                },
            },
            { $sort: { averageRating: -1, reviewCount: -1 } },
            { $limit: 10 },
        ]),
        // Popular categories - based on total activity (books + shelves + reviews)
        Book.aggregate([
            {
                $lookup: {
                    from: "shelves",
                    localField: "_id",
                    foreignField: "bookId",
                    as: "shelves",
                },
            },
            {
                $lookup: {
                    from: "reviews",
                    localField: "_id",
                    foreignField: "bookId",
                    as: "reviews",
                },
            },
            {
                $group: {
                    _id: "$genre",
                    bookCount: { $sum: 1 },
                    shelfCount: { $sum: { $size: "$shelves" } },
                    reviewCount: { $sum: { $size: "$reviews" } },
                },
            },
            {
                $lookup: {
                    from: "genres",
                    localField: "_id",
                    foreignField: "_id",
                    as: "genre",
                },
            },
            { $unwind: "$genre" },
            {
                $project: {
                    _id: 0,
                    genreId: "$genre._id",
                    genreName: "$genre.name",
                    bookCount: 1,
                    shelfCount: 1,
                    reviewCount: 1,
                    totalActivity: {
                        $add: ["$bookCount", "$shelfCount", "$reviewCount"],
                    },
                },
            },
            { $sort: { totalActivity: -1 } },
            { $limit: 10 },
        ]),
    ]);

    return {
        summary: {
            totalUsers,
            totalBooks,
            totalGenres,
            totalTutorials,
            totalReviews,
            pendingReviews,
            approvedReviews,
            totalShelves,
        },
        shelvesByStatus: {
            want: wantShelves,
            reading: readingShelves,
            read: readShelves,
        },
        booksPerGenre,
        topRatedBooks,
        popularCategories,
    };
};

export const AdminAnalyticsService = {
    getAdminDashboardAnalytics,
};

