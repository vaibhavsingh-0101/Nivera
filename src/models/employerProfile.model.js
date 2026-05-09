import mongoose from "mongoose"

const employerProfileSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  companyName: { type: String, required: true },

  companyLogo: String,

  website: String,

  industry: String,

  companySize: {
    type: String,
    enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]
  },

  founded: Number,

  about: String,

  headquarters: String,

  socialLinks: {
    linkedin: String,
    twitter: String,
    facebook: String
  },

  // Contact details
  contactEmail: String,
  contactPhone: String

}, { timestamps: true })

export const EmployerProfile = mongoose.model("EmployerProfile", employerProfileSchema)