import express from "express";
import { ReviewController } from "./review.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { createReviewZodSchema, updateReviewZodSchema } from "./review.validation";
const router = express.Router();

router.post('/create-review', validateRequest(createReviewZodSchema), ReviewController.createReview)
router.get('/', ReviewController.getAllReviews)
router.get('/:id', ReviewController.getSingleReview)
router.patch('/:id', checkAuth(Role.ADMIN), validateRequest(updateReviewZodSchema), ReviewController.updateReview)
router.delete('/:id', checkAuth(Role.ADMIN), ReviewController.deleteReview)
export const reviewRoutes = router; 