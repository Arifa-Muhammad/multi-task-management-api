import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { errorHandler } from "./middlewares/error.middlewre.js"


const app= express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "20kb"}))
app.use(express.urlencoded({limit:"20kb"}))
app.use(express.static("public"))

app.use(cookieParser())
//routes here
import userRouter from "./routes/user.routes.js"
app.use("/api/v1/auth", userRouter)

app.use(errorHandler)

export {app}