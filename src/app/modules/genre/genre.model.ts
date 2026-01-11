import { Schema, model, Types } from "mongoose";
import { IGenre } from "./genre.interface";

const genreSchema = new Schema<IGenre>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
}, { timestamps: true });

export const Genre = model<IGenre>("Genre", genreSchema);