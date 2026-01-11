import express, { Request, Response } from "express"
// import { router } from "./app/routes"
import cors from "cors"

const app = express()

app.use(express.json())
app.use(cors({
     origin: [
        "http://localhost:3000"
    ],
    credentials: true
}))

// app.use("/api/v1", router)

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "BookWorm application is running!!!"
    })
})


export default app;