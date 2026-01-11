import httpStatus from 'http-status-codes';
import { IBook } from "./book.interface";
import AppError from '../../errorHelpers/appError';
import { Book } from './book.model';
import { Genre } from '../genre/genre.model';

const createBook = async (payload: Partial<IBook>) => {
    const { genre } = payload;

    // Check if genre exists
    const isExistGenre = await Genre.findById(genre);
    if (!isExistGenre) {
        throw new AppError(httpStatus.NOT_FOUND, "Genre not found");
    }

    const book = await Book.create(payload);
    
    // Populate genre for response
    await book.populate('genre');
    
    return book;
};

const getAllBooks = async () => {
    const books = await Book.find().populate('genre', 'name description').sort({ createdAt: -1 });
    return books;
};

const getSingleBook = async (id: string) => {
    const book = await Book.findById(id).populate('genre', 'name description');
    if (!book) {
        throw new AppError(httpStatus.NOT_FOUND, "Book Not Found");
    }
    return {
        data: book
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
    }).populate('genre', 'name description');

    return updatedBook;
};

const deleteBook = async (id: string) => {
    const book = await Book.findById(id);
    if (!book) {
        throw new AppError(httpStatus.NOT_FOUND, "Book Not Found");
    }
     
    await Book.findByIdAndDelete(id);
    
    return {
        data: null
    };
};

export const BookServices = {
    createBook,
    getAllBooks,
    getSingleBook,
    updateBook,
    deleteBook,
};
