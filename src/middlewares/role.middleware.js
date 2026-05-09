import { ApiError } from "../utils/apiError.js"

export const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
<<<<<<< HEAD
      return next(new ApiError(403, `Access denied. Required role: ${roles.join(" or ")}`))
    }
    next()
  }
}
=======
      throw new ApiError(403, "Access denied")
    }
    next()
  }
}
>>>>>>> 4a859b334291646d67fba3da3f4686b0ac99a4f6
