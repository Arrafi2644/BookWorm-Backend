import { Types } from "mongoose";

export interface IReview {
  userId : Types.ObjectId;
  bookId: Types.ObjectId;
  rating: number;
  comment: string;
  status: "pending" | "approved"
}