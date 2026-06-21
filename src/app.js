import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import passport from "passport"
import helmet from "helmet"

import "../src/config/passport.js"

import authRoutes from "../src/routes/auth.routes.js"
import workerRoutes from "../src/routes/worker.routes.js"
import employerRoutes from "../src/routes/employer.routes.js"
import planRoutes from "../src/routes/plan.routes.js"
import jobRoutes from "../src/routes/job.routes.js"
import applicationRoutes from "../src/routes/application.routes.js"
import messageRoutes from "../src/routes/message.routes.js"
import postRoutes from "../src/routes/post.routes.js"
import { errorMiddleware } from "../src/middlewares/error.middleware.js"

const app = express()

app.use(helmet())

const allowedOrigins = [
  "https://nivera-psi.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173"
]

app.use(cors({ origin: allowedOrigins, credentials: true }))

// Razorpay webhook needs raw body — mount before express.json()
app.use("/api/v1/plans/webhook", express.raw({ type: "application/json" }))

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(passport.initialize())

// Serve uploaded files
app.use("/uploads", express.static("uploads"))

/* ── Routes ── */
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/worker", workerRoutes)
app.use("/api/v1/employer", employerRoutes)
app.use("/api/v1/plans", planRoutes)
app.use("/api/v1/jobs", jobRoutes)
app.use("/api/v1/applications", applicationRoutes)
app.use("/api/v1/messages", messageRoutes)
app.use("/api/v1/posts", postRoutes)

/* ── Health check ── */
app.get("/health", (req, res) => res.json({ status: "ok" }))

/* ── 404 ── */
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" })
})

app.use(errorMiddleware)

export default app