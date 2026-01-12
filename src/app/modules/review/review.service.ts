import { JwtPayload } from "jsonwebtoken";
import { IReview } from "./review.interface";
import { Review } from "./review.model";
import AppError from "../../errorHelpers/appError";
import { Role } from "../user/user.interface";
import httpStatus from "http-status-codes";
import { QueryBuilder } from '../../utils/QueryBuilder';
import { reviewSearchableFields } from './review.constants';

const createReview = async (userId: string, bookId: string, rating: number, comment: string, status: "pending" | "approved") => {
    const isAlreadyReviewed = await Review.findOne({ userId, bookId });
    if(isAlreadyReviewed){
        throw new AppError(httpStatus.BAD_REQUEST, "You have already reviewed this book.");
    }
    if(rating < 1 || rating > 5){
        throw new AppError(httpStatus.BAD_REQUEST, "Rating must be between 1 and 5.");
    }
    if(comment.length < 2){
        throw new AppError(httpStatus.BAD_REQUEST, "Comment must be at least 2 characters long.");
    }
    const review = await Review.create({ userId, bookId, rating, comment, status });
    return review;
};

const getAllReviews = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Review.find(), query);
    
    const reviewsData = queryBuilder
        .filter()
        .search(reviewSearchableFields)
        .sort()
        .fields()
        .paginate();

    const [data, meta] = await Promise.all([
        reviewsData.build(),
        queryBuilder.getMeta()
    ]);

    return {
        data,
        meta
    };
};

const getSingleReview = async (id: string) => {
    const review = await Review.findById(id);
    return review;
};

const updateReview = async (id: string, payload: Partial<IReview>, decodedToken: JwtPayload) => {
    const existingReview = await Review.findById(id);
    if (!existingReview) {
        throw new AppError(httpStatus.NOT_FOUND, "Review not found");
    }
    if(decodedToken.role !== Role.ADMIN){
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized to update this review.");
    }
    const updatedReview = await Review.findByIdAndUpdate(id, payload, { new: true });
    return updatedReview;   
};

const deleteReview = async (id: string, decodedToken: JwtPayload) => {
    if(decodedToken.role !== Role.ADMIN){
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized to delete this review.");
    }
    const deletedReview = await Review.findByIdAndDelete(id);
    if (!deletedReview) {
        throw new AppError(httpStatus.NOT_FOUND, "Review not found");
    }
    return null;
};

export const ReviewServices = {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
};