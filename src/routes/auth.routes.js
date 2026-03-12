import express from "express"
import passport from "passport"

import {
  registerUser,
  verifyEmail,
  verifyPhone,
  loginUser,
  logoutUser
} from "../controllers/auth.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = express.Router()


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

  }
)



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


export default router