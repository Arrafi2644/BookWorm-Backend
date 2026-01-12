import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TutorialServices } from "./tutorial.service";

const createTutorial = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const decodedToken = req.user as JwtPayload;
    const tutorial = await TutorialServices.createTutorial(payload, decodedToken);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Tutorial created successfully",
        data: tutorial,
    });
});

const getAllTutorials = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await TutorialServices.getAllTutorials(query as Record<string, string>);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Tutorials retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});

const getSingleTutorial = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const tutorial = await TutorialServices.getSingleTutorial(id as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Tutorial retrieved successfully",
        data: tutorial,
    });
});

const updateTutorial = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const tutorial = await TutorialServices.updateTutorial(id as string, payload);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Tutorial updated successfully",
        data: tutorial,
    });
});

const deleteTutorial = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await TutorialServices.deleteTutorial(id as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Tutorial deleted successfully",
        data: null,
    });
});

export const TutorialController = {
    createTutorial,
    getAllTutorials,
    getSingleTutorial,
    updateTutorial,
    deleteTutorial,
};
