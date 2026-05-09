import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import passport from "passport"
import helmet from "helmet"
<<<<<<< HEAD

import "../src/config/passport.js"

import authRoutes from "../src/routes/auth.routes.js"
import workerRoutes from "../src/routes/worker.routes.js"
import employerRoutes from "../src/routes/employer.routes.js"
import planRoutes from "../src/routes/plan.routes.js"
import jobRoutes from "../src/routes/job.routes.js"
import applicationRoutes from "../src/routes/application.routes.js"
import { errorMiddleware } from "../src/middlewares/error.middleware.js"
=======
import "./config/passport.js"



import authRoutes from "./routes/auth.routes.js"
import workerRoutes from "./routes/worker.routes.js"
import { errorMiddleware } from "./middlewares/error.middleware.js"
>>>>>>> 4a859b334291646d67fba3da3f4686b0ac99a4f6

const app = express()

app.use(helmet())

<<<<<<< HEAD
=======

>>>>>>> 4a859b334291646d67fba3da3f4686b0ac99a4f6
const allowedOrigins = [
  "https://nivera-psi.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173"
<<<<<<< HEAD
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

/* ── Health check ── */
app.get("/health", (req, res) => res.json({ status: "ok" }))

/* ── 404 ── */
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" })
})

=======
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
>>>>>>> 4a859b334291646d67fba3da3f4686b0ac99a4f6
app.use(errorMiddleware)

export default app