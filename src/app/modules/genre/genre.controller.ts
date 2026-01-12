import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { GenreServices } from "./genre.service";

const createGenre = catchAsync(async (req: Request, res: Response) => {
    const genre = await GenreServices.createGenre(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Genre created successfully",
        data: genre,
    });
});  

const getAllGenres = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await GenreServices.getAllGenres(query as Record<string, string>);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Genres retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});

const getSingleGenre = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const genre = await GenreServices.getSingleGenre(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Genre retrieved successfully",
        data: genre,
    });
});

const updateGenre = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const payload = req.body;
    const genre = await GenreServices.updateGenre(id, payload);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Genre updated successfully",
        data: genre,
    });
});

const deleteGenre = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string | string[];
    const genre = await GenreServices.deleteGenre(id as string  );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Genre deleted successfully",
        data: genre,
    });
});

export const GenreControllers = {
    createGenre,
    getAllGenres,
    getSingleGenre,
    updateGenre,
    deleteGenre,
};