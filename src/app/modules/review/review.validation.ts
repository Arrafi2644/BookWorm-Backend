import { z } from "zod";

export const createReviewZodSchema = z.object({
  userId: z.string(),
  bookId: z.string(),
  rating: z.number(),
  comment: z.string(),
  status: z.enum(["pending", "approved"]).optional(),
});

export const updateReviewZodSchema = z.object({
  rating: z.number().optional(),
  comment: z.string().optional(),
  status: z.enum(["pending", "approved"]).optional(),
});