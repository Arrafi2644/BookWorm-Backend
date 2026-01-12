import { z } from "zod";

export const createTutorialZodSchema = z.object({
    title: z.string({ required_error: "Title is required" }).min(2, "Title is too short"),
    description: z.string().optional(),
    videoUrl: z
        .string({ required_error: "Video URL is required" })
        .url("Video URL must be a valid URL"),
    category: z.string().optional(),
    isFeatured: z.boolean().optional(),
});

export const updateTutorialZodSchema = z.object({
    title: z.string().min(2, "Title is too short").optional(),
    description: z.string().optional(),
    videoUrl: z.string().url("Video URL must be a valid URL").optional(),
    category: z.string().optional(),
    isFeatured: z.boolean().optional(),
});
