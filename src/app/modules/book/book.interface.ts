import { Types } from "mongoose";

export interface IBook {
    _id?: Types.ObjectId;
    title: string;
    author: string;
    genre: Types.ObjectId;
    description: string;
    coverImage: string;
    pages: number;
    publishedYear: number;
    publisher: string;
    language: string;

}
