import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { Strategy as FacebookStrategy } from "passport-facebook"
import { User } from "../models/user.model.js"


// ====================== GOOGLE ======================
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: "/api/v1/auth/google/callback",
  passReqToCallback: true
},
async (req, accessToken, refreshToken, profile, done) => {
  try {

    const email = profile.emails?.[0]?.value || `${profile.id}@google.com`

    // 🔥 GET ROLE FROM STATE (IMPORTANT FIX)
    const role = req.query.state  
    let user = await User.findOne({
      $or: [
        { email },
        { googleId: profile.id }
      ]
    })

    // CREATE USER
    if (!user) {
      user = await User.create({
        fullName: profile.displayName,
        email,
        googleId: profile.id,
        emailVerified: true,
        phoneVerified: true,
        role
      })
    } 
    // UPDATE ROLE IF CHANGED
    else {
      if (role && user.role !== role) {
        user.role = role
      }
    }

    user.googleId = profile.id
    user.lastLogin = new Date()

    await user.save()

    done(null, user)

  } catch (error) {
    done(error, null)
  }
}))



// ====================== FACEBOOK ======================
passport.use(new FacebookStrategy({
  clientID: process.env.FB_ID,
  clientSecret: process.env.FB_SECRET,
  callbackURL: "/api/v1/auth/facebook/callback",
  profileFields: ["id", "displayName", "emails"],
  passReqToCallback: true
},
async (req, accessToken, refreshToken, profile, done) => {
  try {

    const email = profile.emails?.[0]?.value || `${profile.id}@facebook.com`

    // 🔥 GET ROLE FROM STATE
    const role = req.query.state || "worker"

    let user = await User.findOne({
      $or: [
        { facebookId: profile.id },
        { email }
      ]
    })

    if (!user) {
      user = await User.create({
        fullName: profile.displayName,
        email,
        facebookId: profile.id,
        emailVerified: true,
        role
      })
    } 
    else {
      if (role && user.role !== role) {
        user.role = role
      }
    }

    user.facebookId = profile.id
    user.lastLogin = new Date()

    await user.save()

    done(null, user)

  } catch (error) {
    done(error, null)
  }
}))


// ====================== SESSION ======================
passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (error) {
    done(error, null)
  }
})