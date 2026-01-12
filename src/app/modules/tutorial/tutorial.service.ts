import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/appError";
import { ITutorial } from "./tutorial.interface";
import { Tutorial } from "./tutorial.model";
import { QueryBuilder } from '../../utils/QueryBuilder';
import { tutorialSearchableFields } from './tutorial.constants';

const createTutorial = async (payload: ITutorial, decodedToken: JwtPayload) => {
    const tutorial = await Tutorial.create({
        ...payload,
        createdBy: decodedToken.userId,
    });

    return tutorial.populate("createdBy", "name email role");
};

const getAllTutorials = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(
        Tutorial.find().populate("createdBy", "name email role"),
        query
    );
    
    const tutorialsData = queryBuilder
        .filter()
        .search(tutorialSearchableFields)
        .sort()
        .fields()
        .paginate();

    const [data, meta] = await Promise.all([
        tutorialsData.build(),
        queryBuilder.getMeta()
    ]);

    return {
        data,
        meta
    };
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
