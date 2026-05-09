import express from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { roleMiddleware } from "../middlewares/role.middleware.js"
import {
  listPlans,
  mySubscription,
  createCheckoutSession,
  stripeWebhook
} from "../controllers/plan.controller.js"

const router = express.Router()
const isEmployer = [verifyJWT, roleMiddleware("employer")]

/* ── Public ── */
router.get("/", listPlans)

/* ── Employer Only ── */
router.get("/my-subscription", ...isEmployer, mySubscription)

// ✅ Stripe Checkout (replaces createOrder)
router.post("/create-checkout", ...isEmployer, createCheckoutSession)

/* ── Stripe Webhook ── */
// ⚠️ IMPORTANT: raw body required
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
)

export default router