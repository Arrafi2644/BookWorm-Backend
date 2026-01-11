import { Types } from "mongoose";

export interface IGenre {
    _id: Types.ObjectId,
    name: string,
    description?: string,
}