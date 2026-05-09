import express from "express"
import passport from "passport"
import {
  registerUser, verifyEmail, verifyPhone,
  loginUser, logoutUser, refreshAccessToken, getMe
} from "../controllers/auth.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/register", registerUser)
router.get("/verify-email/:token", verifyEmail)
router.post("/verify-phone", verifyPhone)
router.post("/login", loginUser)
router.post("/logout", verifyJWT, logoutUser)
router.post("/refresh-token", refreshAccessToken)
router.get("/me", verifyJWT, getMe)


/* ── Google OAuth ── */
router.get("/google", (req, res, next) => {
  const role = req.query.role || "worker"
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
    state: role
  })(req, res, next)
})

router.get("/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      const user = req.user
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()
      user.refreshToken = refreshToken
      await user.save()
      res.json({ success: true, message: "Google login success", accessToken, refreshToken, user })
    } catch {
      res.status(500).json({ success: false, message: "Google auth failed" })
    }
  }
)


/* ── Facebook OAuth ── */
router.get("/facebook", (req, res, next) => {
  const role = req.query.role || "worker"
  passport.authenticate("facebook", { scope: ["email"], state: role })(req, res, next)
})

router.get("/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  async (req, res) => {
    try {
      const user = req.user
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()
      user.refreshToken = refreshToken
      await user.save()
      res.json({ success: true, message: "Facebook login success", accessToken, refreshToken, user })
    } catch {
      res.status(500).json({ success: false, message: "Facebook auth failed" })
    }
  }
)

export default router