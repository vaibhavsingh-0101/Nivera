import { Plan } from "../models/plan.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Payment } from "../models/payment.model.js"
import { stripe } from "../config/Stripe.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse, asyncHandler } from "../utils/helpers.js"


/* ── List all plans ── */
export const listPlans = asyncHandler(async (req, res) => {
  const plans = await Plan.find({ isActive: true }).sort({ displayPrice: 1 })
  res.json(new ApiResponse(200, plans))
})


/* ── Get current subscription ── */
export const mySubscription = asyncHandler(async (req, res) => {
  const sub = await Subscription.findOne({
    employer: req.user._id,
    isActive: true,
    endDate: { $gt: new Date() }
  }).populate("plan")

  res.json(new ApiResponse(200, sub || null))
})


/* ── Create Stripe Checkout Session ── */
export const createCheckoutSession = asyncHandler(async (req, res) => {
  const { planId } = req.body

  const plan = await Plan.findById(planId)
  if (!plan || !plan.isActive) {
    throw new ApiError(404, "Plan not found")
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",

    customer_email: req.user.email, // optional but useful

    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: plan.name
          },
          unit_amount: plan.price // in paise
        },
        quantity: 1
      }
    ],

    metadata: {
      employerId: req.user._id.toString(),
      planId: plan._id.toString()
    },

    success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/cancel`
  })

  // Save pending payment
  await Payment.create({
    employer: req.user._id,
    plan: plan._id,
    stripeSessionId: session.id,
    amount: plan.price,
    status: "created"
  })

  res.json(new ApiResponse(200, { url: session.url }, "Checkout session created"))
})


/* ── Stripe Webhook ── */
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"]

  let event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  /* ✅ Payment Success */
  if (event.type === "checkout.session.completed") {
    const session = event.data.object

    const { employerId, planId } = session.metadata

    const plan = await Plan.findById(planId)
    if (!plan) return

    // Update payment
    await Payment.findOneAndUpdate(
      { stripeSessionId: session.id },
      {
        status: "paid",
        stripePaymentIntentId: session.payment_intent
      }
    )

    // Deactivate old subscription
    await Subscription.updateMany(
      { employer: employerId, isActive: true },
      { isActive: false }
    )

    // Create new subscription
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + plan.validityDays)

    await Subscription.create({
      employer: employerId,
      plan: plan._id,
      planName: plan.name,
      jobPostLimit: plan.jobPostLimit,
      endDate,
      paymentId: session.payment_intent
    })
  }

  /* ❌ Payment Failed */
  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object

    await Payment.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntent.id },
      { status: "failed" }
    )
  }

  res.json({ received: true })
}

/* ── Dev Bypass subscription creation ── */
export const devSubscribe = asyncHandler(async (req, res) => {
  const { planId } = req.body

  const plan = await Plan.findById(planId)
  if (!plan) throw new ApiError(404, "Plan not found")

  // Deactivate old active subscription
  await Subscription.updateMany(
    { employer: req.user._id, isActive: true },
    { isActive: false }
  )

  // Create new active subscription
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + (plan.validityDays || 30))

  const sub = await Subscription.create({
    employer: req.user._id,
    plan: plan._id,
    planName: plan.name,
    jobPostLimit: plan.jobPostLimit,
    endDate,
    isActive: true,
    paymentId: "dev_payment_mock"
  })

  const populatedSub = await Subscription.findById(sub._id).populate("plan")

  res.status(201).json(new ApiResponse(201, populatedSub, "Mock subscription activated successfully (Dev Bypass)"))
})