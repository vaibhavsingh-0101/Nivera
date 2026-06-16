import mongoose from "mongoose"

const planSchema = new mongoose.Schema({

  name: {
    type: String,
    enum: ["Basic", "Standard", "Premium"],
    required: true,
    unique: true
  },

  price: {
    type: Number,  // in INR paise (Razorpay uses smallest unit)
    required: true
  },

  displayPrice: {
    type: Number,  // human-readable INR
    required: true
  },

  jobPostLimit: {
    type: Number,
    required: true
    // -1 = unlimited (Premium)
  },

  validityDays: {
    type: Number,
    default: 30
  },

  features: [String],

  isActive: { type: Boolean, default: true }

}, { timestamps: true })

export const Plan = mongoose.model("Plan", planSchema)


/* Seed plans — call once on startup */
export const seedPlans = async () => {
  const count = await Plan.countDocuments()
  if (count > 0) return

  await Plan.insertMany([
    {
      name: "Basic",
      price: 49900,          // ₹499
      displayPrice: 499,
      jobPostLimit: 5,
      validityDays: 30,
      features: [
        "5 job posts per month",
        "Basic applicant management",
        "Email support"
      ]
    },
    {
      name: "Standard",
      price: 149900,         // ₹1499
      displayPrice: 1499,
      jobPostLimit: 15,
      validityDays: 30,
      features: [
        "15 job posts per month",
        "Advanced applicant filtering",
        "Priority email support",
        "Company profile page"
      ]
    },
    {
      name: "Premium",
      price: 399900,         // ₹3999
      displayPrice: 3999,
      jobPostLimit: -1,      // unlimited
      validityDays: 30,
      features: [
        "Unlimited job posts",
        "AI-powered candidate matching",
        "Dedicated account manager",
        "Analytics dashboard",
        "Featured company listing"
      ]
    }
  ])

  console.log("✅ Plans seeded")
}