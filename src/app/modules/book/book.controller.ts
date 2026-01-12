import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { BookServices } from "./book.service";
import { JwtPayload } from "jsonwebtoken";

const createBook = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    
    // Get cover image URL from multer file upload
    if (req.file) {
        payload.coverImage = (req.file as any).path;
    }

    const book = await BookServices.createBook(payload);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Book created successfully",
        data: book,
    });
});

const getAllBooks = catchAsync(async (req: Request, res: Response) => {
    const books = await BookServices.getAllBooks();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Books retrieved successfully",
        data: books,
    });
});

const getSingleBook = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const book = await BookServices.getSingleBook(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Book retrieved successfully",
        data: book.data,
    });
});

const updateBook = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const payload = req.body;

    // Get cover image URL from multer file upload if new image is uploaded
    if (req.file) {
        payload.coverImage = (req.file as any).path;
    }

    const book = await BookServices.updateBook(id, payload);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Book updated successfully",
        data: book,
    });
});

const deleteBook = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await BookServices.deleteBook(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Book deleted successfully",
        data: result.data,
    });
});

const getPersonalizedRecommendations = catchAsync(
    async (req: Request, res: Response) => {
        const decodedToken = req.user as JwtPayload;
        const recommendations = await BookServices.getPersonalizedRecommendations(
            decodedToken
        );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Personalized recommendations fetched successfully",
            data: recommendations,
        });
    }
);

export const BookControllers = {
    createBook,
    getAllBooks,
    getSingleBook,
    updateBook,
    deleteBook,
    getPersonalizedRecommendations,
};
