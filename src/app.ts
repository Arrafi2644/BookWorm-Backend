import express, { Request, Response } from "express"
import { router } from "./app/routes"
import { globalErrorHandler } from "./app/middleware/globalErrorHandler"
import notFound from "./app/middleware/notFound"
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express()

app.use(cookieParser());
app.use(express.json())
app.use(cors({
     origin: [
        "http://localhost:3000"
    ],
    credentials: true
}))

app.use("/api/v1", router)

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Book-Worm application is running!!!"
    })
})

app.use(globalErrorHandler)
app.use(notFound)

export default app;