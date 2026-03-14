import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const userSchema = new mongoose.Schema({

  fullName:{
    type:String,
    required:true
  },

  username:{
    type:String,
    unique:true
  },

  email:{
    type:String,
    required:true,
    unique:true
  },

  phone:{
    type:String,
    required:true,
    unique:true
  },

  password:{
    type:String,
    required:true
  },

  role:{
    type:String,
    enum:["worker","employer"],
    required:true
  },

  emailVerified:{
    type:Boolean,
    default:false
  },

  phoneVerified:{
    type:Boolean,
    default:false
  },

  emailVerificationToken:String,
  emailVerificationExpiry:Date,

  refreshToken:String

},{timestamps:true})



/* AUTO GENERATE USERNAME + HASH PASSWORD */

userSchema.pre("save", async function () {

  if(!this.username && this.fullName){
    this.username = this.fullName
      .toLowerCase()
      .replace(/\s+/g,"-")
  }

  if (!this.isModified("password")) return

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)

})



/* PASSWORD CHECK */

userSchema.methods.isPasswordCorrect = async function(password){

  return await bcrypt.compare(password,this.password)

}



/* ACCESS TOKEN */

userSchema.methods.generateAccessToken = function(){

  return jwt.sign(
    {_id:this._id},
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn:"15m"}
  )

}



/* REFRESH TOKEN */

userSchema.methods.generateRefreshToken = function(){

  return jwt.sign(
    {_id:this._id},
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn:"7d"}
  )

}



/* EMAIL TOKEN */

userSchema.methods.generateEmailToken = function(){

  const token = crypto.randomBytes(32).toString("hex")

  const hashedToken = crypto
  .createHash("sha256")
  .update(token)
  .digest("hex")

  this.emailVerificationToken = hashedToken
  this.emailVerificationExpiry = Date.now() + 600000

  return token

}

export const User = mongoose.model("User",userSchema)