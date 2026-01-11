import { z } from "zod";

export const createBookZodSchema = z.object({
    title: z.string().min(1, "Title is required").max(200, "Title must be at most 200 characters"),
    author: z.string().min(1, "Author is required").max(100, "Author must be at most 100 characters"),
    genre: z.string().min(1, "Genre is required"),
    description: z.string().min(1, "Description is required"),
    pages: z.number().min(1, "Pages is required"),
    publishedYear: z.number().min(1, "Published year is required"),
    publisher: z.string().min(1, "Publisher is required"),
    language: z.string().min(1, "Language is required"),
    coverImage: z.string().min(1, "Cover image is required").optional(),
});

export const updateBookZodSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    author: z.string().min(1).max(100).optional(),
    genre: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    pages: z.number().min(1).optional(),
    publishedYear: z.number().min(1).optional(),
    publisher: z.string().min(1).optional(),
    language: z.string().min(1).optional(),
    coverImage: z.string().min(1).optional(),
});
