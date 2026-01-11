import express from "express";                  
import { GenreControllers } from "./genre.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { createGenreZodSchema, updateGenreZodSchema } from "./genre.validation";
const router = express.Router();

router.post('/create-genre', checkAuth(Role.ADMIN), validateRequest(createGenreZodSchema), GenreControllers.createGenre)
router.get('/', GenreControllers.getAllGenres)
router.get('/:id', GenreControllers.getSingleGenre)
router.patch('/:id', checkAuth(Role.ADMIN), validateRequest(updateGenreZodSchema), GenreControllers.updateGenre)
router.delete('/:id', checkAuth(Role.ADMIN), GenreControllers.deleteGenre)

export const genreRoutes = router;