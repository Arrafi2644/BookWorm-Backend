import { z } from "zod";

export const createShelfZodSchema = z.object({
    userId: z.string({ invalid_type_error: "User ID must be a string" }).optional(),
    bookId: z.string({ invalid_type_error: "Book ID must be a string" }),
    status: z.enum(["want", "reading", "read"], { invalid_type_error: "Status must be either want, reading, or read" }).optional(),
    readCompletedPage: z.number({ invalid_type_error: "Completed page must be a number" }).optional(),
});

export const updateShelfZodSchema = z.object({
    status: z.enum(["want", "reading", "read"], { invalid_type_error: "Status must be either want, reading, or read" }).optional(),
    readCompletedPage: z.number({ invalid_type_error: "Completed page must be a number" }).optional(),
});