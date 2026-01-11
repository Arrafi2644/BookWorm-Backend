import { z } from "zod";

export const createGenreZodSchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
});

export const updateGenreZodSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().optional(),
});