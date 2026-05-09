import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/apiError.js"

/**
 * Blocks the request if the employer has no valid, active subscription.
 * Attach this AFTER verifyJWT and roleMiddleware("employer").
 */
export const requireActivePlan = async (req, res, next) => {
  try {
    const sub = await Subscription.findOne({
      employer: req.user._id,
      isActive: true,
      endDate: { $gt: new Date() }
    }).populate("plan")

    if (!sub) {
      return next(
        new ApiError(
          403,
          "No active subscription. Please purchase a plan to post jobs."
        )
      )
    }

    // Attach subscription to request so controllers can use it
    req.subscription = sub
    next()
  } catch (error) {
    next(error)
  }
}


/**
 * Blocks the request if employer has exhausted their job post limit.
 * Use this specifically on the "create job" route.
 */
export const checkPostLimit = async (req, res, next) => {
  try {
    const sub = req.subscription  // set by requireActivePlan

    if (!sub) {
      return next(new ApiError(403, "Subscription not found on request"))
    }

    if (sub.jobPostLimit !== -1 && sub.jobPostsUsed >= sub.jobPostLimit) {
      return next(
        new ApiError(
          403,
          `Job post limit reached (${sub.jobPostLimit}/${sub.jobPostLimit}). Upgrade your plan to post more.`
        )
      )
    }

    next()
  } catch (error) {
    next(error)
  }
}