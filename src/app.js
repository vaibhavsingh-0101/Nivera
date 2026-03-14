import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import passport from "passport"
import helmet from "helmet"
import "./config/passport.js"



import authRoutes from "./routes/auth.routes.js"
import workerRoutes from "./routes/worker.routes.js"
import { errorMiddleware } from "./middlewares/error.middleware.js"

const app = express()

app.use(helmet())


const allowedOrigins = [
  "https://nivera-psi.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);
app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/worker",workerRoutes)
app.use(errorMiddleware)

export default app