import express from "express";
import { TutorialController } from "./tutorial.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import {
    createTutorialZodSchema,
    updateTutorialZodSchema,
} from "./tutorial.validation";

const router = express.Router();

router.post(
    "/",
    checkAuth(Role.ADMIN),
    validateRequest(createTutorialZodSchema),
    TutorialController.createTutorial
);

router.get("/", checkAuth(...Object.values(Role)), TutorialController.getAllTutorials);

router.get("/:id", checkAuth(...Object.values(Role)), TutorialController.getSingleTutorial);

router.patch(
    "/:id",
    checkAuth(Role.ADMIN),
    validateRequest(updateTutorialZodSchema),
    TutorialController.updateTutorial
);

router.delete("/:id", checkAuth(Role.ADMIN), TutorialController.deleteTutorial);

export const tutorialRoutes = router;
