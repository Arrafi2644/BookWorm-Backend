import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AdminAnalyticsService } from "./adminAnalytics.service";

const getAdminDashboardAnalytics = catchAsync(
    async (req: Request, res: Response) => {
        const data = await AdminAnalyticsService.getAdminDashboardAnalytics();

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Admin dashboard analytics fetched successfully",
            data,
        });
    }
);

export const AdminAnalyticsController = {
    getAdminDashboardAnalytics,
};

