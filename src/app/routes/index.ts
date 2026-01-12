import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";
import { genreRoutes } from "../modules/genre/genre.route";
import { bookRoutes } from "../modules/book/book.route";
import { reviewRoutes } from "../modules/review/review.route";
import { shelfRoutes } from "../modules/shelf/shelf.route";
import { tutorialRoutes } from "../modules/tutorial/tutorial.route";


export const router = Router();

const moduleRoutes = [
    {
        path: "/user",
        route: userRoutes
    },
    {
        path: "/auth",
        route: authRoutes
    },
    {
        path: "/genre",
        route: genreRoutes
    },
    {
        path: "/book",
        route: bookRoutes
    },
    {
        path: "/review",
        route: reviewRoutes
    },
    {
        path: "/shelf",
        route: shelfRoutes
    },
    {
        path: "/tutorial",
        route: tutorialRoutes
    }
]

moduleRoutes.forEach(route => {
    router.use(route.path, route.route)
})