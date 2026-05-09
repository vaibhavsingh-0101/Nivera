import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/apiError.js"
import { isTokenBlacklisted } from "../services/token.service.js"

export const verifyJWT = async (req, res, next) => {
  try {
<<<<<<< HEAD
=======
    // 🔐 1. Extract token (Header + Cookie support)
>>>>>>> 4a859b334291646d67fba3da3f4686b0ac99a4f6
    let token = null

    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1]
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken
    }

<<<<<<< HEAD
    if (!token) throw new ApiError(401, "Access token missing")

    const isBlacklisted = await isTokenBlacklisted(token)
    if (isBlacklisted) throw new ApiError(401, "Token is invalid or logged out")

=======
    if (!token) {
      throw new ApiError(401, "Access token missing")
    }

    // 🔴 2. Check blacklist (Redis)
    const isBlacklisted = await isTokenBlacklisted(token)
    if (isBlacklisted) {
      throw new ApiError(401, "Token is invalid or logged out")
    }

    // 🔐 3. Verify token
>>>>>>> 4a859b334291646d67fba3da3f4686b0ac99a4f6
    let decoded
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    } catch (err) {
<<<<<<< HEAD
      if (err.name === "TokenExpiredError") throw new ApiError(401, "Token expired")
      throw new ApiError(401, "Invalid token")
    }

=======
      if (err.name === "TokenExpiredError") {
        throw new ApiError(401, "Token expired")
      }
      throw new ApiError(401, "Invalid token")
    }

    // 👤 4. Fetch user (lean for performance)
>>>>>>> 4a859b334291646d67fba3da3f4686b0ac99a4f6
    const user = await User.findById(decoded._id)
      .select("-password -refreshToken")
      .lean()

<<<<<<< HEAD
    if (!user) throw new ApiError(401, "User not found")

    req.user = user
=======
    if (!user) {
      throw new ApiError(401, "User not found")
    }

    // ⚡ 5. Attach to request
    req.user = user

>>>>>>> 4a859b334291646d67fba3da3f4686b0ac99a4f6
    next()
  } catch (error) {
    next(error)
  }
}