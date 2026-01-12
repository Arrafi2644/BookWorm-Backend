import express from "express";
import { AdminAnalyticsController } from "./adminAnalytics.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";

const router = express.Router();

router.get(
    "/dashboard",
    checkAuth(Role.ADMIN),
    AdminAnalyticsController.getAdminDashboardAnalytics
);

export const adminAnalyticsRoutes = router;

