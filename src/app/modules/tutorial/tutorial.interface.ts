import { Types } from "mongoose";

export interface ITutorial {
    _id?: Types.ObjectId;
    title: string;
    description?: string;
    videoUrl: string;
    category?: string;
    isFeatured?: boolean;
    createdBy: Types.ObjectId;
}
