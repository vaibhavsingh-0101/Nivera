import { Application } from "../models/application.model.js"
import { Job } from "../models/job.model.js"
import { WorkerProfile } from "../models/workerProfile.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse, asyncHandler } from "../utils/helpers.js"
import { enqueueEmail } from "../services/notification.service.js"
import { EmployerProfile } from "../models/employerProfile.model.js"


/* ── Worker: apply for a job ── */
export const applyForJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId)

  if (!job || job.status !== "active")
    throw new ApiError(404, "Job not found or no longer accepting applications")

  if (job.applicationDeadline && job.applicationDeadline < new Date())
    throw new ApiError(400, "Application deadline has passed")

  const alreadyApplied = await Application.findOne({
    job: job._id,
    worker: req.user._id
  })

  if (alreadyApplied)
    throw new ApiError(409, "You have already applied for this job")

  const workerProfile = await WorkerProfile.findOne({ user: req.user._id })

  const application = await Application.create({
    job: job._id,
    worker: req.user._id,
    employer: job.employer,
    coverLetter: req.body.coverLetter,
    resumeSnapshot: workerProfile?.resume || {},
    statusHistory: [{ status: "applied" }]
  })

  // Update job applications count
  await Job.findByIdAndUpdate(job._id, { $inc: { applicationsCount: 1 } })

  // Notify worker
  const employerProfile = await EmployerProfile.findOne({ user: job.employer })
  await enqueueEmail("application_received", {
    workerEmail: req.user.email,
    jobTitle: job.title,
    companyName: employerProfile?.companyName || "the employer"
  })

  res.status(201).json(new ApiResponse(201, application, "Application submitted successfully"))
})


/* ── Worker: get own applications ── */
export const getMyApplications = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query

  const filter = { worker: req.user._id }
  if (status) filter.status = status

  const [applications, total] = await Promise.all([
    Application.find(filter)
      .populate({
        path: "job",
        select: "title location jobType workType salary employer",
        populate: { path: "employerProfile", select: "companyName companyLogo" }
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Application.countDocuments(filter)
  ])

  res.json(new ApiResponse(200, {
    applications,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) }
  }))
})


/* ── Worker: check if applied ── */
export const checkApplication = asyncHandler(async (req, res) => {
  const application = await Application.findOne({
    job: req.params.jobId,
    worker: req.user._id
  }).select("status createdAt")

  res.json(new ApiResponse(200, { applied: !!application, application }))
})


/* ── Worker: withdraw application ── */
export const withdrawApplication = asyncHandler(async (req, res) => {
  const application = await Application.findOne({
    _id: req.params.id,
    worker: req.user._id
  })

  if (!application) throw new ApiError(404, "Application not found")

  if (["shortlisted", "hired"].includes(application.status))
    throw new ApiError(400, "Cannot withdraw after being shortlisted or hired")

  await application.deleteOne()
  await Job.findByIdAndUpdate(application.job, { $inc: { applicationsCount: -1 } })

  res.json(new ApiResponse(200, {}, "Application withdrawn"))
})


/* ── Employer: get applicants for a job ── */
export const getJobApplications = asyncHandler(async (req, res) => {
  const job = await Job.findOne({ _id: req.params.jobId, employer: req.user._id })
  if (!job) throw new ApiError(404, "Job not found")

  const { status, page = 1, limit = 10 } = req.query

  const filter = { job: job._id }
  if (status) filter.status = status

  const [applications, total] = await Promise.all([
    Application.find(filter)
      .populate({
        path: "worker",
        select: "fullName username email"
      })
      .populate({
        path: "worker",
        // Second populate for workerProfile via aggregate is below
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Application.countDocuments(filter)
  ])

  // Attach worker profiles
  const workerIds = applications.map((a) => a.worker?._id).filter(Boolean)
  const profiles = await WorkerProfile.find({ user: { $in: workerIds } })
    .select("resumeHeadline keySkills profilePhoto resume profileCompleteness")
  const profileMap = Object.fromEntries(profiles.map((p) => [p.user.toString(), p]))

  const enriched = applications.map((app) => ({
    ...app.toObject(),
    workerProfile: profileMap[app.worker?._id?.toString()] || null
  }))

  // Mark as viewed if not already
  await Application.updateMany(
    { job: job._id, status: "applied" },
    { status: "viewed", $push: { statusHistory: { status: "viewed" } } }
  )

  res.json(new ApiResponse(200, {
    applications: enriched,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) }
  }))
})


/* ── Employer: update application status ── */
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status, note, interview } = req.body

  const validStatuses = ["shortlisted", "rejected", "hired"]
  if (!validStatuses.includes(status))
    throw new ApiError(400, `Status must be one of: ${validStatuses.join(", ")}`)

  const application = await Application.findOne({
    _id: req.params.id,
    employer: req.user._id
  }).populate("worker", "email").populate("job", "title")

  if (!application) throw new ApiError(404, "Application not found")

  application.status = status
  application.statusHistory.push({ status, note })

  if (interview && status === "shortlisted") {
    application.interview = interview
  }

  await application.save()

  // Notify worker
  await enqueueEmail("status_updated", {
    workerEmail: application.worker.email,
    jobTitle: application.job.title,
    status
  })

  res.json(new ApiResponse(200, application, `Application marked as ${status}`))
})


/* ── Employer: add private notes on applicant ── */
export const addEmployerNote = asyncHandler(async (req, res) => {
  const application = await Application.findOne({
    _id: req.params.id,
    employer: req.user._id
  })

  if (!application) throw new ApiError(404, "Application not found")

  application.employerNotes = req.body.notes
  await application.save()

  res.json(new ApiResponse(200, {}, "Notes saved"))
})