import AppError from "../../errorHelpers/appError";
import { IShelf } from "./shelf.interface";
import { Shelf } from "./shelf.model";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status-codes";

const addBookToShelf = async (payload: IShelf, decodedToken: JwtPayload) => {
    const isExistShelf = await Shelf.findOne({ userId: decodedToken.userId, bookId: payload.bookId });
    if(isExistShelf){
        throw new AppError(httpStatus.BAD_REQUEST, "Book already exists");
    }
    const shelf = await Shelf.create({ ...payload, userId: decodedToken.userId });
    return shelf;
};

const getAllBooksOnShelf = async () => {
    const shelves = await Shelf.find().populate("userId").populate("bookId");
    return shelves;
};

const getSingleShelfBook = async (id: string) => {
    const shelf = await Shelf.findById(id).populate("userId").populate("bookId");
    return shelf;
};
const updateBookShelf = async (id: string, payload: Partial<IShelf>, decodedToken: JwtPayload) => {
    const shelf = await Shelf.findById(id);
    if (!shelf) {
        throw new AppError(httpStatus.NOT_FOUND, "Shelf not found");
    }
    if (shelf.userId.toString() !== decodedToken.userId) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized to update this shelf");
    }
    const updatedShelf = await Shelf.findByIdAndUpdate(id, payload, { new: true })
        .populate("userId")
        .populate("bookId");
    return updatedShelf;
};

const deleteBookFromSelf = async (id: string, decodedToken: JwtPayload) => {
    const shelf = await Shelf.findById(id);
    if (!shelf) {
        throw new AppError(httpStatus.NOT_FOUND, "Book not found");
    }
    if (shelf.userId.toString() !== decodedToken.userId) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized to delete this shelf");
    }
    await Shelf.findByIdAndDelete(id);
    return { message: "Shelf deleted successfully" };
};

export const ShelfServices = {
    addBookToShelf,
    getAllBooksOnShelf,
    getSingleShelfBook,
    updateBookShelf,
    deleteBookFromSelf
};