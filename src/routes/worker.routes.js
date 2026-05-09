import express from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { roleMiddleware } from "../middlewares/role.middleware.js"
import { upload } from "../middlewares/upload.middleware.js"
import * as worker from "../controllers/worker.controller.js"

const router = express.Router()
const isWorker = [verifyJWT, roleMiddleware("worker")]

// Public
router.get("/profile/:username", worker.getWorkerByUsername)

// Protected (worker only)
router.post("/create", ...isWorker, worker.createProfile)
router.get("/me", ...isWorker, worker.getProfile)

router.put("/headline", ...isWorker, worker.updateHeadline)
router.put("/skills", ...isWorker, worker.updateSkills)

router.post("/it-skill", ...isWorker, worker.addITSkill)
router.put("/it-skill/:id", ...isWorker, worker.updateITSkill)
router.delete("/it-skill/:id", ...isWorker, worker.deleteITSkill)

router.post("/employment", ...isWorker, worker.addEmployment)
router.put("/employment/:id", ...isWorker, worker.updateEmployment)
router.delete("/employment/:id", ...isWorker, worker.deleteEmployment)

router.post("/education", ...isWorker, worker.addEducation)
router.put("/education/:id", ...isWorker, worker.updateEducation)
router.delete("/education/:id", ...isWorker, worker.deleteEducation)

router.post("/project", ...isWorker, worker.addProject)
router.put("/project/:id", ...isWorker, worker.updateProject)
router.delete("/project/:id", ...isWorker, worker.deleteProject)

router.put("/summary", ...isWorker, worker.updateSummary)
router.put("/career", ...isWorker, worker.updateCareerProfile)
router.put("/personal", ...isWorker, worker.updatePersonalDetails)
router.put("/diversity", ...isWorker, worker.updateDiversity)

router.post("/upload-resume", ...isWorker, upload.single("resume"), worker.uploadResume)
router.post("/upload-photo", ...isWorker, upload.single("photo"), worker.uploadPhoto)

export default router