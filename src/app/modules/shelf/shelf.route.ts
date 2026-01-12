import express from "express";
import { ShelfController } from "./shelf.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { createShelfZodSchema, updateShelfZodSchema } from "./shelf.validation";

const router = express.Router();

router.post(
    '/add-book',
    checkAuth(...Object.values(Role)),
    validateRequest(createShelfZodSchema),
    ShelfController.addBookToShelf
);

router.get('/', ShelfController.getAllBooksOnShelf);

router.get('/:id', ShelfController.getSingleShelfBook);

router.patch(
    '/:id',
    checkAuth(...Object.values(Role)),
    validateRequest(updateShelfZodSchema),
    ShelfController.updateBookShelf
);

router.delete(
    '/:id',
    checkAuth(...Object.values(Role)),
    ShelfController.deleteBookFromShelf
);

export const shelfRoutes = router;
