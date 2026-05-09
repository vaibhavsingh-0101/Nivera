import { Job } from "../models/job.model.js"
import { Subscription } from "../models/subscription.model.js"
import { EmployerProfile } from "../models/employerProfile.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse, asyncHandler } from "../utils/helpers.js"


/* ── Employer: post a new job ── */
export const createJob = asyncHandler(async (req, res) => {
  const {
    title, description, requirements, skills,
    location, workType, jobType, salary,
    experience, education, industry, department,
    openings, applicationDeadline
  } = req.body

  if (!title || !description || !location)
    throw new ApiError(400, "Title, description, and location are required")

  const employerProfile = await EmployerProfile.findOne({ user: req.user._id })
  if (!employerProfile)
    throw new ApiError(400, "Please complete your company profile before posting jobs")

  const job = await Job.create({
    employer: req.user._id,
    employerProfile: employerProfile._id,
    title, description, requirements, skills,
    location, workType, jobType, salary,
    experience, education, industry, department,
    openings, applicationDeadline
  })

  // Increment posts used on subscription
  await Subscription.findOneAndUpdate(
    { employer: req.user._id, isActive: true, endDate: { $gt: new Date() } },
    { $inc: { jobPostsUsed: 1 } }
  )

  res.status(201).json(new ApiResponse(201, job, "Job posted successfully"))
})


/* ── Employer: update job ── */
export const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, employer: req.user._id })
  if (!job) throw new ApiError(404, "Job not found")

  const allowed = [
    "title", "description", "requirements", "skills",
    "location", "workType", "jobType", "salary", "experience",
    "education", "industry", "department", "openings",
    "applicationDeadline", "status"
  ]

  allowed.forEach((f) => {
    if (req.body[f] !== undefined) job[f] = req.body[f]
  })

  await job.save()
  res.json(new ApiResponse(200, job, "Job updated"))
})


/* ── Employer: delete job ── */
export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findOneAndDelete({ _id: req.params.id, employer: req.user._id })
  if (!job) throw new ApiError(404, "Job not found")

  // Decrement post count
  await Subscription.findOneAndUpdate(
    { employer: req.user._id, isActive: true },
    { $inc: { jobPostsUsed: -1 } }
  )

  res.json(new ApiResponse(200, {}, "Job deleted"))
})


/* ── Employer: list own jobs ── */
export const getMyJobs = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query

  const filter = { employer: req.user._id }
  if (status) filter.status = status

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Job.countDocuments(filter)
  ])

  res.json(new ApiResponse(200, {
    jobs,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) }
  }))
})


/* ── Worker / Public: search jobs ── */
export const searchJobs = asyncHandler(async (req, res) => {
  const {
    q, skills, location, jobType, workType,
    salaryMin, salaryMax, experience,
    industry, page = 1, limit = 10
  } = req.query

  const filter = {
    status: "active",
    $or: [
      { applicationDeadline: { $gt: new Date() } },
      { applicationDeadline: { $exists: false } }
    ]
  }

  if (q) filter.$text = { $search: q }

  if (skills) {
    const skillList = skills.split(",").map((s) => s.trim())
    filter.skills = { $in: skillList }
  }

  if (location) filter.location = { $regex: location, $options: "i" }
  if (jobType) filter.jobType = jobType
  if (workType) filter.workType = workType
  if (industry) filter.industry = { $regex: industry, $options: "i" }

  if (salaryMin) filter["salary.min"] = { $gte: Number(salaryMin) }
  if (salaryMax) filter["salary.max"] = { $lte: Number(salaryMax) }

  if (experience) {
    const exp = Number(experience)
    filter["experience.min"] = { $lte: exp }
    filter["experience.max"] = { $gte: exp }
  }

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .populate("employerProfile", "companyName companyLogo industry headquarters")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean(),
    Job.countDocuments(filter)
  ])

  res.json(new ApiResponse(200, {
    jobs,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) }
  }))
})


/* ── Worker / Public: get single job ── */
export const getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate("employerProfile", "companyName companyLogo industry headquarters about website")

  if (!job || job.status !== "active") throw new ApiError(404, "Job not found")

  // Increment views (fire-and-forget)
  Job.findByIdAndUpdate(job._id, { $inc: { views: 1 } }).exec()

  res.json(new ApiResponse(200, job))
})


/* ── Worker: jobs matching own skills ── */
export const getMatchingJobs = asyncHandler(async (req, res) => {
  const { WorkerProfile } = await import("../models/workerProfile.model.js")
  const profile = await WorkerProfile.findOne({ user: req.user._id })

  if (!profile || !profile.keySkills?.length) {
    throw new ApiError(400, "Please add skills to your profile to see matching jobs")
  }

  const { page = 1, limit = 10 } = req.query

  const filter = {
    status: "active",
    skills: { $in: profile.keySkills },
    $or: [
      { applicationDeadline: { $gt: new Date() } },
      { applicationDeadline: { $exists: false } }
    ]
  }

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .populate("employerProfile", "companyName companyLogo industry headquarters")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean(),
    Job.countDocuments(filter)
  ])

  res.json(new ApiResponse(200, {
    jobs,
    matchedSkills: profile.keySkills,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) }
  }))
})