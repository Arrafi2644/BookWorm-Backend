import express from "express";
import { BookControllers } from "./book.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { createBookZodSchema, updateBookZodSchema } from "./book.validation";
import { multerUpload } from "../../config/multer.config";

const router = express.Router();

router.post(
    "/create-book",
    checkAuth(Role.ADMIN),
    multerUpload.single("coverImage"),
    validateRequest(createBookZodSchema),
    BookControllers.createBook
);

router.get("/", BookControllers.getAllBooks);

router.get(
    "/recommendations",
    checkAuth(...Object.values(Role)),
    BookControllers.getPersonalizedRecommendations
);

router.get("/:id", BookControllers.getSingleBook);

router.patch(
    "/:id",
    checkAuth(Role.ADMIN),
    multerUpload.single("coverImage"),
    validateRequest(updateBookZodSchema),
    BookControllers.updateBook
);

router.delete("/:id", checkAuth(Role.ADMIN), BookControllers.deleteBook);

// [Already implemented above, this is likely redundant, but if an explicit additional route is needed:]

router.get(
    "/personalized-recommendations",
    checkAuth(...Object.values(Role)),
    BookControllers.getPersonalizedRecommendations
);




export const bookRoutes = router;
