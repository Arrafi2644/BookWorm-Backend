import { Types } from "mongoose";

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER",
}

export interface IUser {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    picture: string;
    role: Role;
    bookReadingGoal?: number,
}
