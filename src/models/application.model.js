import mongoose from "mongoose"

const applicationSchema = new mongoose.Schema({

  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },

  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  coverLetter: String,

  resumeSnapshot: {
    url: String,
    name: String
  },

  status: {
    type: String,
    enum: ["applied", "viewed", "shortlisted", "rejected", "hired"],
    default: "applied"
  },

  statusHistory: [
    {
      status: String,
      changedAt: { type: Date, default: Date.now },
      note: String
    }
  ],

  // Employer notes (private)
  employerNotes: String,

  // Interview details
  interview: {
    scheduledAt: Date,
    type: { type: String, enum: ["phone", "video", "onsite"] },
    link: String,
    notes: String
  }

}, { timestamps: true })


/* Prevent duplicate applications */
applicationSchema.index({ job: 1, worker: 1 }, { unique: true })

export const Application = mongoose.model("Application", applicationSchema)