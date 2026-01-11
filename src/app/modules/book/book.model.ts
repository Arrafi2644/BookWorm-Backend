import { Schema, model } from "mongoose";
import { IBook } from "./book.interface";

const bookSchema = new Schema<IBook>({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    genre: {
        type: Schema.Types.ObjectId,
        ref: "Genre",
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
        required: true,
    },
    pages: {
        type: Number,
        required: true,
    },
    publishedYear: {
        type: Number,
        required: true,
    },
    publisher: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

export const Book = model<IBook>("Book", bookSchema);
