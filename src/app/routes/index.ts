import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";
import { genreRoutes } from "../modules/genre/genre.route";
import { bookRoutes } from "../modules/book/book.route";


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
    }
]

moduleRoutes.forEach(route => {
    router.use(route.path, route.route)
})