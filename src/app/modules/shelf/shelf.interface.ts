import { Types } from "mongoose";

export type ShelfStatus = "want" | "reading" | "read";

export interface IShelf {
  _id?: Types.ObjectId;        
  userId: Types.ObjectId;     
  bookId: Types.ObjectId;     
  status: ShelfStatus;      
  readCompletedPage?: number;        
  createdAt?: Date;
  updatedAt?: Date;
}
