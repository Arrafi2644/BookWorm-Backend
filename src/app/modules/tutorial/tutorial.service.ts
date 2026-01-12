import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/appError";
import { ITutorial } from "./tutorial.interface";
import { Tutorial } from "./tutorial.model";

const createTutorial = async (payload: ITutorial, decodedToken: JwtPayload) => {
    const tutorial = await Tutorial.create({
        ...payload,
        createdBy: decodedToken.userId,
    });

    return tutorial.populate("createdBy", "name email role");
};

const getAllTutorials = async () => {
    return Tutorial.find()
        .populate("createdBy", "name email role")
        .sort({ createdAt: -1 });
};

const getSingleTutorial = async (id: string) => {
    const tutorial = await Tutorial.findById(id).populate("createdBy", "name email role");
    if (!tutorial) {
        throw new AppError(httpStatus.NOT_FOUND, "Tutorial not found");
    }
    return tutorial;
};

const updateTutorial = async (id: string, payload: Partial<ITutorial>) => {
    const tutorial = await Tutorial.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    }).populate("createdBy", "name email role");

    if (!tutorial) {
        throw new AppError(httpStatus.NOT_FOUND, "Tutorial not found");
    }

    return tutorial;
};

const deleteTutorial = async (id: string) => {
    const tutorial = await Tutorial.findByIdAndDelete(id);

    if (!tutorial) {
        throw new AppError(httpStatus.NOT_FOUND, "Tutorial not found");
    }

    return null;
};

export const TutorialServices = {
    createTutorial,
    getAllTutorials,
    getSingleTutorial,
    updateTutorial,
    deleteTutorial,
};
