import express from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { roleMiddleware } from "../middlewares/role.middleware.js"
import { upload } from "../middlewares/upload.middleware.js"
import * as employer from "../controllers/employer.controller.js"

const router = express.Router()
const isEmployer = [verifyJWT, roleMiddleware("employer")]

// Public
router.get("/company/:username", employer.getCompanyByUsername)

// Protected (employer only)
router.post("/create", ...isEmployer, employer.createProfile)
router.get("/me", ...isEmployer, employer.getProfile)
router.put("/update", ...isEmployer, employer.updateProfile)
router.post("/upload-logo", ...isEmployer, upload.single("logo"), employer.uploadLogo)

export default router