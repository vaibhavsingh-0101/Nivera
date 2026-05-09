import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const userSchema = new mongoose.Schema({

  fullName: { type: String, required: true },

  username: { type: String, unique: true, sparse: true },

  email: { type: String, required: true, unique: true },

  phone: { type: String, unique: true, sparse: true },

  password: { type: String },

  role: {
    type: String,
    enum: ["worker", "employer"],
    required: true
  },

  googleId: { type: String, unique: true, sparse: true },
  facebookId: { type: String, unique: true, sparse: true },

  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },

  emailVerificationToken: String,
  emailVerificationExpiry: Date,

  refreshToken: String,
  lastLogin: Date

}, { timestamps: true })


/* AUTO GENERATE USERNAME + HASH PASSWORD */
userSchema.pre("save", async function () {

  if (!this.username && this.fullName) {
    const base = this.fullName.toLowerCase().replace(/\s+/g, "-")
    const suffix = Math.floor(1000 + Math.random() * 9000)
    this.username = `${base}-${suffix}`
  }

  if (!this.isModified("password") || !this.password) return

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})


/* PASSWORD CHECK */
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}


/* ACCESS TOKEN */
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, role: this.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  )
}


/* REFRESH TOKEN */
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  )
}


/* EMAIL TOKEN */
userSchema.methods.generateEmailToken = function () {
  const token = crypto.randomBytes(32).toString("hex")
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
  this.emailVerificationToken = hashedToken
  this.emailVerificationExpiry = Date.now() + 600000
  return token
}

export const User = mongoose.model("User", userSchema)
