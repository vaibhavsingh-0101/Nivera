import { User } from "../models/user.model.js"
import { WorkerProfile } from "../models/workerProfile.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse, asyncHandler } from "../utils/helpers.js"


/* ── Public: view worker by username ── */
export const getWorkerByUsername = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username })
  if (!user) throw new ApiError(404, "Worker not found")

  const profile = await WorkerProfile.findOne({ user: user._id })

  res.json(new ApiResponse(200, {
    user: { fullName: user.fullName, username: user.username },
    profile
  }))
})


/* ── Create profile (on first login) ── */
export const createProfile = asyncHandler(async (req, res) => {
  const existing = await WorkerProfile.findOne({ user: req.user._id })
  if (existing) return res.json(new ApiResponse(200, existing, "Profile already exists"))

  const profile = await WorkerProfile.create({ user: req.user._id })
  res.status(201).json(new ApiResponse(201, profile, "Profile created"))
})


/* ── Get own profile ── */
export const getProfile = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOne({ user: req.user._id })
  if (!profile) throw new ApiError(404, "Profile not found. Please create your profile first.")
  res.json(new ApiResponse(200, profile))
})


/* ── Headline ── */
export const updateHeadline = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { user: req.user._id },
    { resumeHeadline: req.body.headline },
    { new: true }
  )
  res.json(new ApiResponse(200, profile, "Headline updated"))
})


/* ── Skills ── */
export const updateSkills = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { user: req.user._id },
    { $set: { keySkills: req.body.skills } },
    { new: true }
  )
  res.json(new ApiResponse(200, profile, "Skills updated"))
})


/* ── IT Skills ── */
export const addITSkill = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { user: req.user._id },
    { $push: { itSkills: req.body } },
    { new: true }
  )
  res.json(new ApiResponse(200, profile, "IT skill added"))
})

export const updateITSkill = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { "itSkills._id": req.params.id },
    { $set: { "itSkills.$.skill": req.body.skill, "itSkills.$.level": req.body.level } },
    { new: true }
  )
  res.json(new ApiResponse(200, profile, "IT skill updated"))
})

export const deleteITSkill = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { itSkills: { _id: req.params.id } } },
    { new: true }
  )
  res.json(new ApiResponse(200, profile, "IT skill removed"))
})


/* ── Employment ── */
export const addEmployment = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { user: req.user._id },
    { $push: { employment: req.body } },
    { new: true }
  )
  res.json(new ApiResponse(200, profile, "Employment added"))
})

export const updateEmployment = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { "employment._id": req.params.id },
    { $set: { "employment.$": req.body } },
    { new: true }
  )
  res.json(new ApiResponse(200, profile, "Employment updated"))
})

export const deleteEmployment = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { employment: { _id: req.params.id } } },
    { new: true }
  )
  res.json(new ApiResponse(200, profile, "Employment removed"))
})


/* ── Education ── */
export const addEducation = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { user: req.user._id },
    { $push: { education: req.body } },
    { new: true }
  )
  res.json(new ApiResponse(200, profile, "Education added"))
})

export const updateEducation = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { "education._id": req.params.id },
    { $set: { "education.$": req.body } },
    { new: true }
  )
  res.json(new ApiResponse(200, profile, "Education updated"))
})

export const deleteEducation = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { education: { _id: req.params.id } } },
    { new: true }
  )
  res.json(new ApiResponse(200, profile, "Education removed"))
})


/* ── Projects ── */
export const addProject = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { user: req.user._id },
    { $push: { projects: req.body } },
    { new: true }
  )
  res.json(new ApiResponse(200, profile, "Project added"))
})

export const updateProject = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { "projects._id": req.params.id },
    { $set: { "projects.$": req.body } },
    { new: true }
  )
  res.json(new ApiResponse(200, profile, "Project updated"))
})

export const deleteProject = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { projects: { _id: req.params.id } } },
    { new: true }
  )
  res.json(new ApiResponse(200, profile, "Project removed"))
})


/* ── Summary / Career / Personal / Diversity ── */
export const updateSummary = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { user: req.user._id },
    { profileSummary: req.body.summary },
    { new: true }
  )
  res.json(new ApiResponse(200, profile, "Summary updated"))
})

export const updateCareerProfile = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { user: req.user._id },
    { careerProfile: req.body },
    { new: true }
  )
  res.json(new ApiResponse(200, profile, "Career profile updated"))
})

export const updatePersonalDetails = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { user: req.user._id },
    { personalDetails: req.body },
    { new: true }
  )
  res.json(new ApiResponse(200, profile, "Personal details updated"))
})

export const updateDiversity = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { user: req.user._id },
    { diversity: req.body },
    { new: true }
  )
  res.json(new ApiResponse(200, profile, "Diversity info updated"))
})


/* ── File uploads ── */
export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No file uploaded")

  await WorkerProfile.findOneAndUpdate(
    { user: req.user._id },
    {
      resume: {
        url: req.file.path,
        name: req.file.originalname,
        uploadedAt: new Date()
      }
    }
  )

  res.json(new ApiResponse(200, { path: req.file.path }, "Resume uploaded"))
})

export const uploadPhoto = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No file uploaded")

  await WorkerProfile.findOneAndUpdate(
    { user: req.user._id },
    { profilePhoto: req.file.path }
  )

  res.json(new ApiResponse(200, { path: req.file.path }, "Profile photo uploaded"))
})