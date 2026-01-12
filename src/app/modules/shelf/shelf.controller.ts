import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import { ShelfServices } from "./shelf.service";

const addBookToShelf = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const decodedToken = req.user as JwtPayload;
    const shelf = await ShelfServices.addBookToShelf(payload, decodedToken);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Book added to shelf successfully",
        data: shelf,
    });
});

const getAllBooksOnShelf = catchAsync(async (req: Request, res: Response) => {
    const shelves = await ShelfServices.getAllBooksOnShelf();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Books on shelf retrieved successfully",
        data: shelves,
    });
});

const getSingleShelfBook = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const shelf = await ShelfServices.getSingleShelfBook(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Shelf book retrieved successfully",
        data: shelf,
    });
});

const updateBookShelf = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const payload = req.body;
    const decodedToken = req.user as JwtPayload;
    const shelf = await ShelfServices.updateBookShelf(id, payload, decodedToken);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Book shelf updated successfully",
        data: shelf,
    });
});

const deleteBookFromShelf = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const decodedToken = req.user as JwtPayload;
    const shelf = await ShelfServices.deleteBookFromSelf(id, decodedToken);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Shelf deleted successfully",
        data: shelf,
    });
}); 

export const ShelfController = {
   addBookToShelf,
   getAllBooksOnShelf,
   getSingleShelfBook,
   deleteBookFromShelf,
   updateBookShelf,
};