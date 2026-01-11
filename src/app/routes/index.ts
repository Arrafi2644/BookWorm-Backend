import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";
import { genreRoutes } from "../modules/genre/genre.route";


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
    }
]

moduleRoutes.forEach(route => {
    router.use(route.path, route.route)
})