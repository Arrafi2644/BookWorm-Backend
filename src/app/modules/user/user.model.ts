import { Schema, model, Types } from "mongoose";
import { IUser, Role } from "./user.interface";

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.USER,
        required: true,
    },
    bookReadingGoal: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});

export const User = model("User", userSchema);
