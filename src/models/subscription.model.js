import mongoose from "mongoose"

const subscriptionSchema = new mongoose.Schema({

  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan",
    required: true
  },

  planName: String,          // snapshot at purchase time
  jobPostLimit: Number,      // -1 = unlimited
  jobPostsUsed: { type: Number, default: 0 },

  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },

  isActive: { type: Boolean, default: true },

  // Payment reference
  paymentId: String,
  razorpayOrderId: String

}, { timestamps: true })


/* Virtual: remaining posts */
subscriptionSchema.virtual("jobPostsRemaining").get(function () {
  if (this.jobPostLimit === -1) return Infinity
  return Math.max(0, this.jobPostLimit - this.jobPostsUsed)
})


/* Check if subscription is still valid */
subscriptionSchema.methods.isValid = function () {
  return this.isActive && this.endDate > new Date()
}


subscriptionSchema.set("toJSON", { virtuals: true })
subscriptionSchema.set("toObject", { virtuals: true })

export const Subscription = mongoose.model("Subscription", subscriptionSchema)