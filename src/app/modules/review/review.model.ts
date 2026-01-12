import { model, Schema } from "mongoose";
import { IReview } from "./review.interface";

const reviewSchema = new Schema<IReview>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  status: { type: String, enum: ["pending", "approved"], default: "pending", required: true },
});

export const Review = model<IReview>("Review", reviewSchema);