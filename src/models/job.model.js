import mongoose from "mongoose"

const jobSchema = new mongoose.Schema({

  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  employerProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EmployerProfile"
  },

  title: { type: String, required: true },

  description: { type: String, required: true },

  requirements: [String],

  skills: [String],                  // for worker skill-match

  location: { type: String, required: true },

  workType: {
    type: String,
    enum: ["onsite", "remote", "hybrid"],
    default: "onsite"
  },

  jobType: {
    type: String,
    enum: ["full-time", "part-time", "contract", "internship", "freelance"],
    default: "full-time"
  },

  salary: {
    min: Number,
    max: Number,
    currency: { type: String, default: "INR" },
    period: { type: String, enum: ["monthly", "yearly", "hourly"], default: "yearly" }
  },

  experience: {
    min: Number,   // years
    max: Number
  },

  education: String,

  industry: String,

  department: String,

  openings: { type: Number, default: 1 },

  applicationDeadline: Date,

  status: {
    type: String,
    enum: ["active", "paused", "closed"],
    default: "active"
  },

  applicationsCount: { type: Number, default: 0 },

  views: { type: Number, default: 0 }

}, { timestamps: true })


/* Index for skill-based search */
jobSchema.index({ skills: 1 })
jobSchema.index({ status: 1, applicationDeadline: 1 })
jobSchema.index({ title: "text", description: "text", skills: "text" })

export const Job = mongoose.model("Job", jobSchema)