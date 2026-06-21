import express from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { roleMiddleware } from "../middlewares/role.middleware.js"
import { requireActivePlan, checkPostLimit } from "../middlewares/plan.middleware.js"
import {
  createJob, updateJob, deleteJob, getMyJobs,
  searchJobs, getJob, getMatchingJobs, getMatchingWorkersForJob
} from "../controllers/job.controller.js"

const router = express.Router()
const isEmployer = [verifyJWT, roleMiddleware("employer")]
const isWorker = [verifyJWT, roleMiddleware("worker")]

/* ── Public / Worker: browse jobs ── */
router.get("/search", searchJobs)
router.get("/:id", getJob)

/* ── Worker: skill-matched jobs ── */
router.get("/feed/matching", ...isWorker, getMatchingJobs)

/* ── Employer: manage own jobs ── */
// createJob requires: active plan + post limit not exceeded
router.post(
  "/",
  ...isEmployer,
  requireActivePlan,
  checkPostLimit,
  createJob
)

router.get("/employer/my-jobs", ...isEmployer, getMyJobs)
router.get("/:id/matching-workers", ...isEmployer, getMatchingWorkersForJob)
router.put("/:id", ...isEmployer, updateJob)
router.delete("/:id", ...isEmployer, deleteJob)

export default router