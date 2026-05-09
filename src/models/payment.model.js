import mongoose from "mongoose"

const paymentSchema = new mongoose.Schema({

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

  // Stripe identifiers
  stripeSessionId: String,        // Checkout Session ID (cs_...)
  stripePaymentIntentId: String,  // Payment Intent ID (pi_...)
  stripeCustomerId: String,       // Customer ID (cus_...)

  amount: Number,       // in cents (or smallest currency unit)
  currency: { type: String, default: "inr" },

  status: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending"
  }

}, { timestamps: true })

export const Payment = mongoose.model("Payment", paymentSchema)