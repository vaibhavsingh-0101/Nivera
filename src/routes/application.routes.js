import express from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { roleMiddleware } from "../middlewares/role.middleware.js"
import {
  applyForJob, getMyApplications, checkApplication,
  withdrawApplication, getJobApplications,
  updateApplicationStatus, addEmployerNote
} from "../controllers/application.controller.js"

const router = express.Router()
const isWorker = [verifyJWT, roleMiddleware("worker")]
const isEmployer = [verifyJWT, roleMiddleware("employer")]

/* ── Worker routes ── */
router.post("/apply/:jobId", ...isWorker, applyForJob)
router.get("/my-applications", ...isWorker, getMyApplications)
router.get("/check/:jobId", ...isWorker, checkApplication)
router.delete("/:id/withdraw", ...isWorker, withdrawApplication)

/* ── Employer routes ── */
router.get("/job/:jobId", ...isEmployer, getJobApplications)
router.patch("/:id/status", ...isEmployer, updateApplicationStatus)
router.patch("/:id/notes", ...isEmployer, addEmployerNote)

export default router