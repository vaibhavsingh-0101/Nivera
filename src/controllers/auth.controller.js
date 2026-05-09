import crypto from "crypto"
import { User } from "../models/user.model.js"
import { sendVerificationEmail } from "../services/email.service.js"
import { sendPhoneOTP, verifyPhoneOTP } from "../services/sms.service.js"
import { blacklistToken } from "../services/token.service.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse, asyncHandler } from "../utils/helpers.js"


export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, phone, password, role } = req.body

  if (!fullName || !email || !phone || !password || !role)
    throw new ApiError(400, "All fields required")

  if (!["worker", "employer"].includes(role))
    throw new ApiError(400, "Role must be worker or employer")

  const existing = await User.findOne({ $or: [{ email }, { phone }] })
  if (existing) throw new ApiError(409, "User already exists")

  const user = new User({ fullName, email, phone, password, role })
  const emailToken = user.generateEmailToken()
  await user.save()

  await sendVerificationEmail(email, emailToken)
  await sendPhoneOTP(phone)

  res.status(201).json(
    new ApiResponse(201, { username: user.username }, "Verification email and OTP sent")
  )
})


export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: { $gt: Date.now() }
  })

  if (!user) throw new ApiError(400, "Invalid or expired token")

  user.emailVerified = true
  user.emailVerificationToken = undefined
  user.emailVerificationExpiry = undefined
  await user.save()

  res.json(new ApiResponse(200, {}, "Email verified successfully"))
})


export const verifyPhone = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body
  const user = await User.findOne({ phone })
  if (!user) throw new ApiError(404, "User not found")

  const valid = await verifyPhoneOTP(phone, otp)
  if (!valid) throw new ApiError(400, "Invalid OTP")

  user.phoneVerified = true
  await user.save()

  res.json(new ApiResponse(200, {}, "Phone verified successfully"))
})


export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) throw new ApiError(404, "User not found")

  if (!user.emailVerified) throw new ApiError(403, "Please verify your email first")
  if (!user.phoneVerified) throw new ApiError(403, "Please verify your phone first")

  if (!user.password) throw new ApiError(400, "Use Google/Facebook to login")

  const valid = await user.isPasswordCorrect(password)
  if (!valid) throw new ApiError(401, "Invalid credentials")

  const accessToken = user.generateAccessToken()
  const refreshToken = user.generateRefreshToken()

  user.refreshToken = refreshToken
  user.lastLogin = new Date()
  await user.save({ validateBeforeSave: false })

  const userData = {
    _id: user._id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    role: user.role
  }

  res
    .cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "strict" })
    .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "strict" })
    .json(new ApiResponse(200, { user: userData, accessToken, refreshToken }, "Login successful"))
})


export const logoutUser = asyncHandler(async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies?.accessToken

  if (token) await blacklistToken(token, 900)

  await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } })

  res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, {}, "Logged out successfully"))
})


export const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken
  if (!token) throw new ApiError(401, "Refresh token missing")

  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
  const user = await User.findById(decoded._id)

  if (!user || user.refreshToken !== token)
    throw new ApiError(401, "Invalid refresh token")

  const accessToken = user.generateAccessToken()
  res
    .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
    .json(new ApiResponse(200, { accessToken }, "Token refreshed"))
})


export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -refreshToken")
  res.json(new ApiResponse(200, user, "User details"))
})