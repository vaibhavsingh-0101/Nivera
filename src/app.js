import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import passport from "passport"
import helmet from "helmet"
import "./config/passport.js"

import authRoutes from "./routes/auth.routes.js"
import { errorMiddleware } from "./middlewares/error.middleware.js"

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())

app.use("/api/v1/auth", authRoutes)

app.use(errorMiddleware)

export default app