import { Schema, model } from "mongoose";
import { ITutorial } from "./tutorial.interface";

const tutorialSchema = new Schema<ITutorial>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
        },
        videoUrl: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Tutorial = model<ITutorial>("Tutorial", tutorialSchema);
