import express from "express";                  
import { BookControllers } from "./book.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { createBookZodSchema, updateBookZodSchema } from "./book.validation";
import { multerUpload } from "../../config/multer.config";

const router = express.Router();

router.post(
    '/create-book', 
    checkAuth(Role.ADMIN), 
    multerUpload.single('coverImage'),
    validateRequest(createBookZodSchema), 
    BookControllers.createBook
);

router.get('/', BookControllers.getAllBooks);

router.get('/:id', BookControllers.getSingleBook);

router.patch(
    '/:id', 
    checkAuth(Role.ADMIN), 
    multerUpload.single('coverImage'),
    validateRequest(updateBookZodSchema), 
    BookControllers.updateBook
);

router.delete('/:id', checkAuth(Role.ADMIN), BookControllers.deleteBook);

export const bookRoutes = router;
