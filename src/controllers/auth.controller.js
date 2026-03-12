import crypto from "crypto"
import {User} from "../models/user.model.js"
import {sendVerificationEmail} from "../services/email.service.js"
import {sendPhoneOTP,verifyPhoneOTP} from "../services/sms.service.js"
import {blacklistToken} from "../services/token.service.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {redisClient} from "../config/redis.js"



export const registerUser = asyncHandler(async(req,res)=>{

  const {fullName,email,phone,password,role} = req.body

  if(!fullName || !email || !phone || !password || !role)
  throw new ApiError(400,"All fields required")


  const existing = await User.findOne({$or:[{email},{phone}]})

  if(existing)
  throw new ApiError(409,"User already exists")


  const key = `otp:${email}`

  const count = await redisClient.incr(key)

  if(count === 1)
  await redisClient.expire(key,60)

  if(count > 3)
  throw new ApiError(429,"Too many OTP requests")


  const user = new User({
    fullName,
    email,
    phone,
    password,
    role
  })


  const emailToken = user.generateEmailToken()

  await user.save()


  await sendVerificationEmail(email,emailToken)

  await sendPhoneOTP(phone)


  res.status(201).json(
    new ApiResponse(201,{}, "Verification email sent")
  )

})



export const verifyEmail = asyncHandler(async(req,res)=>{

  const {token} = req.params

  const hashedToken = crypto
  .createHash("sha256")
  .update(token)
  .digest("hex")


  const user = await User.findOne({
    emailVerificationToken:hashedToken,
    emailVerificationExpiry:{$gt:Date.now()}
  })


  if(!user)
  throw new ApiError(400,"Invalid token")


  user.emailVerified = true

  user.emailVerificationToken = undefined
  user.emailVerificationExpiry = undefined

  await user.save()

  res.json(new ApiResponse(200,{}, "Email verified"))

})



export const verifyPhone = asyncHandler(async(req,res)=>{

  const {phone,otp} = req.body

  const user = await User.findOne({phone})

  if(!user)
  throw new ApiError(404,"User not found")


  const valid = await verifyPhoneOTP(phone,otp)

  if(!valid)
  throw new ApiError(400,"Invalid OTP")


  user.phoneVerified = true

  await user.save()

  res.json(new ApiResponse(200,{}, "Phone verified"))

})



export const loginUser = asyncHandler(async(req,res)=>{

  const {email,password} = req.body

  const user = await User.findOne({email})

  if(!user)
  throw new ApiError(404,"User not found")

  if(!user.emailVerified)
  throw new ApiError(403,"Email not verified")

  if(!user.phoneVerified)
  throw new ApiError(403,"Phone not verified")


  const valid = await user.isPasswordCorrect(password)

  if(!valid)
  throw new ApiError(401,"Invalid credentials")


  const accessToken = user.generateAccessToken()
  const refreshToken = user.generateRefreshToken()

  user.refreshToken = refreshToken

  await user.save({validateBeforeSave:false})


  res
  .cookie("accessToken",accessToken,{httpOnly:true})
  .cookie("refreshToken",refreshToken,{httpOnly:true})
  .json(new ApiResponse(200,{accessToken},"Login success"))

})



export const logoutUser = asyncHandler(async(req,res)=>{

  const token = req.header("Authorization")?.replace("Bearer ","")

  if(token)
  await blacklistToken(token,900)


  await User.findByIdAndUpdate(req.user._id,{
    $set:{refreshToken:null}
  })

  res.json(new ApiResponse(200,{},"Logged out"))

})