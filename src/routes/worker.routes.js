import express from "express"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/upload.middleware.js"

import * as worker from "../controllers/worker.controller.js"

const router = express.Router()

router.get("/profile/:username",worker.getWorkerByUsername)
router.post("/create",verifyJWT,worker.createProfile)

router.get("/me",verifyJWT,worker.getProfile)


router.put("/headline",verifyJWT,worker.updateHeadline)

router.put("/skills",verifyJWT,worker.updateSkills)


router.post("/it-skill",verifyJWT,worker.addITSkill)
router.put("/it-skill/:id",verifyJWT,worker.updateITSkill)
router.delete("/it-skill/:id",verifyJWT,worker.deleteITSkill)


router.post("/employment",verifyJWT,worker.addEmployment)
router.put("/employment/:id",verifyJWT,worker.updateEmployment)
router.delete("/employment/:id",verifyJWT,worker.deleteEmployment)


router.post("/education",verifyJWT,worker.addEducation)
router.put("/education/:id",verifyJWT,worker.updateEducation)
router.delete("/education/:id",verifyJWT,worker.deleteEducation)


router.post("/project",verifyJWT,worker.addProject)
router.put("/project/:id",verifyJWT,worker.updateProject)
router.delete("/project/:id",verifyJWT,worker.deleteProject)


router.put("/summary",verifyJWT,worker.updateSummary)

router.put("/career",verifyJWT,worker.updateCareerProfile)

router.put("/personal",verifyJWT,worker.updatePersonalDetails)

router.put("/diversity",verifyJWT,worker.updateDiversity)


router.post("/upload-resume",verifyJWT,upload.single("resume"),worker.uploadResume)

router.post("/upload-photo",verifyJWT,upload.single("photo"),worker.uploadPhoto)


export default router