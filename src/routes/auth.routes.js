import express from "express"
import passport from "passport"
<<<<<<< HEAD
import {
  registerUser, verifyEmail, verifyPhone,
  loginUser, logoutUser, refreshAccessToken, getMe
} from "../controllers/auth.controller.js"
=======

import {
  registerUser,
  verifyEmail,
  verifyPhone,
  loginUser,
  logoutUser
} from "../controllers/auth.controller.js"

>>>>>>> 4a859b334291646d67fba3da3f4686b0ac99a4f6
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = express.Router()

<<<<<<< HEAD
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
=======

// ================= NORMAL AUTH =================

// REGISTER
router.post("/register", registerUser)

// EMAIL VERIFY (Button Click)
router.get("/verify-email/:token", verifyEmail)

// PHONE OTP VERIFY
router.post("/verify-phone", verifyPhone)

// LOGIN
router.post("/login", loginUser)

// LOGOUT
router.post("/logout", verifyJWT, logoutUser)



// ================= GOOGLE LOGIN =================

router.get(
  "/google",
  (req, res, next) => {

    const role = req.query.role || "worker"

    passport.authenticate("google", {
      scope: ["profile", "email"],
      prompt: "select_account",
      state: role
    })(req, res, next)

  }
)


router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {

    try {

      const user = req.user

      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      user.refreshToken = refreshToken

      await user.save()

      res.json({
        success: true,
        message: "Google login success",
        accessToken,
        refreshToken,
        user
      })

    } catch (error) {

      res.status(500).json({
        success: false,
        message: "Google auth failed"
      })

    }

>>>>>>> 4a859b334291646d67fba3da3f4686b0ac99a4f6
  }
)


<<<<<<< HEAD
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

=======

// ================= FACEBOOK LOGIN =================

router.get(
  "/facebook",
  (req, res, next) => {

    const role = req.query.role || "worker"

    passport.authenticate("facebook", {
      scope: ["email"],
      state: role
    })(req, res, next)

  }
)


router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  async (req, res) => {

    try {

      const user = req.user

      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      user.refreshToken = refreshToken

      await user.save()

      res.json({
        success: true,
        message: "Facebook login success",
        accessToken,
        refreshToken,
        user
      })

    } catch (error) {

      res.status(500).json({
        success: false,
        message: "Facebook auth failed"
      })

    }

  }
)


>>>>>>> 4a859b334291646d67fba3da3f4686b0ac99a4f6
export default router