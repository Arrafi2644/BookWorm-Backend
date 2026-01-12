import { model, Schema } from "mongoose";

import { IShelf } from "./shelf.interface";

const shelfSchema = new Schema<IShelf>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    status: { type: String, enum: ["want", "reading", "read"], default: "want",  required: true },
    readCompletedPage: { type: Number, default: 0 },
}, { timestamps: true });

export const Shelf = model<IShelf>("Shelf", shelfSchema);