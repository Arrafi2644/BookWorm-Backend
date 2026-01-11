import express from "express";
import { UserControllers } from "./user.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "./user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";

const router = express.Router();

router.post('/create-user', validateRequest(createUserZodSchema), UserControllers.createUser)
router.get('/me', checkAuth(...Object.values(Role)), UserControllers.getMe)
router.get("/:id", checkAuth(Role.ADMIN), UserControllers.getSingleUser )
router.delete("/:id", checkAuth(Role.ADMIN), UserControllers.deleteUser )
router.patch("/:id", checkAuth(Role.ADMIN), validateRequest(updateUserZodSchema), UserControllers.updateUser)

export const userRoutes = router;

