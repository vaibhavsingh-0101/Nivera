import { EmployerProfile } from "../models/employerProfile.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse, asyncHandler } from "../utils/helpers.js"


/* ── Create / Get employer profile ── */
export const createProfile = asyncHandler(async (req, res) => {
  const existing = await EmployerProfile.findOne({ user: req.user._id })
  if (existing) return res.json(new ApiResponse(200, existing, "Profile already exists"))

  const { companyName, industry, about, website, companySize, headquarters } = req.body

  if (!companyName) throw new ApiError(400, "Company name is required")

  const profile = await EmployerProfile.create({
    user: req.user._id,
    companyName,
    industry,
    about,
    website,
    companySize,
    headquarters
  })

  res.status(201).json(new ApiResponse(201, profile, "Employer profile created"))
})


export const getProfile = asyncHandler(async (req, res) => {
  const profile = await EmployerProfile.findOne({ user: req.user._id })
  if (!profile) throw new ApiError(404, "Profile not found. Please create your company profile.")

  // Attach subscription info
  const sub = await Subscription.findOne({
    employer: req.user._id,
    isActive: true,
    endDate: { $gt: new Date() }
  }).populate("plan")

  res.json(new ApiResponse(200, { profile, subscription: sub || null }))
})


export const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    "companyName", "industry", "about", "website",
    "companySize", "founded", "headquarters",
    "socialLinks", "contactEmail", "contactPhone"
  ]

  const updates = {}
  allowedFields.forEach((f) => {
    if (req.body[f] !== undefined) updates[f] = req.body[f]
  })

  const profile = await EmployerProfile.findOneAndUpdate(
    { user: req.user._id },
    updates,
    { new: true, runValidators: true }
  )

  if (!profile) throw new ApiError(404, "Profile not found")

  res.json(new ApiResponse(200, profile, "Profile updated"))
})


export const uploadLogo = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No file uploaded")

  await EmployerProfile.findOneAndUpdate(
    { user: req.user._id },
    { companyLogo: req.file.path }
  )

  res.json(new ApiResponse(200, { path: req.file.path }, "Logo uploaded"))
})


/* ── Public: view employer company page ── */
export const getCompanyByUsername = asyncHandler(async (req, res) => {
  const { username } = req.params

  const { User } = await import("../models/user.model.js")
  const user = await User.findOne({ username, role: "employer" })
  if (!user) throw new ApiError(404, "Company not found")

  const profile = await EmployerProfile.findOne({ user: user._id })
  if (!profile) throw new ApiError(404, "Company profile not found")

  res.json(new ApiResponse(200, {
    company: {
      fullName: user.fullName,
      username: user.username
    },
    profile
  }))
})