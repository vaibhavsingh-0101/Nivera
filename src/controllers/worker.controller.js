<<<<<<< HEAD
import { User } from "../models/user.model.js"
import { WorkerProfile } from "../models/workerProfile.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse, asyncHandler } from "../utils/helpers.js"


/* ── Public: view worker by username ── */
export const getWorkerByUsername = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username })
  if (!user) throw new ApiError(404, "Worker not found")

  const profile = await WorkerProfile.findOne({ user: user._id })

  res.json(new ApiResponse(200, {
    user: { fullName: user.fullName, username: user.username },
    profile
  }))
})


/* ── Create profile (on first login) ── */
export const createProfile = asyncHandler(async (req, res) => {
  const existing = await WorkerProfile.findOne({ user: req.user._id })
  if (existing) return res.json(new ApiResponse(200, existing, "Profile already exists"))

  const profile = await WorkerProfile.create({ user: req.user._id })
  res.status(201).json(new ApiResponse(201, profile, "Profile created"))
})


/* ── Get own profile ── */
export const getProfile = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOne({ user: req.user._id })
  if (!profile) throw new ApiError(404, "Profile not found. Please create your profile first.")
  res.json(new ApiResponse(200, profile))
})


/* ── Headline ── */
export const updateHeadline = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { user: req.user._id },
    { resumeHeadline: req.body.headline },
    { new: true }
  )
  res.json(new ApiResponse(200, profile, "Headline updated"))
})


/* ── Skills ── */
export const updateSkills = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { user: req.user._id },
    { $set: { keySkills: req.body.skills } },
    { new: true }
  )
  res.json(new ApiResponse(200, profile, "Skills updated"))
})


/* ── IT Skills ── */
export const addITSkill = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { user: req.user._id },
    { $push: { itSkills: req.body } },
    { new: true }
  )
  res.json(new ApiResponse(200, profile, "IT skill added"))
})

export const updateITSkill = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { "itSkills._id": req.params.id },
    { $set: { "itSkills.$.skill": req.body.skill, "itSkills.$.level": req.body.level } },
    { new: true }
  )
  res.json(new ApiResponse(200, profile, "IT skill updated"))
})

export const deleteITSkill = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { itSkills: { _id: req.params.id } } },
    { new: true }
  )
  res.json(new ApiResponse(200, profile, "IT skill removed"))
})


/* ── Employment ── */
export const addEmployment = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { user: req.user._id },
    { $push: { employment: req.body } },
    { new: true }
  )
  res.json(new ApiResponse(200, profile, "Employment added"))
})

export const updateEmployment = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { "employment._id": req.params.id },
    { $set: { "employment.$": req.body } },
    { new: true }
  )
  res.json(new ApiResponse(200, profile, "Employment updated"))
})

export const deleteEmployment = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { employment: { _id: req.params.id } } },
    { new: true }
  )
  res.json(new ApiResponse(200, profile, "Employment removed"))
})


/* ── Education ── */
export const addEducation = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { user: req.user._id },
    { $push: { education: req.body } },
    { new: true }
  )
  res.json(new ApiResponse(200, profile, "Education added"))
})

export const updateEducation = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { "education._id": req.params.id },
    { $set: { "education.$": req.body } },
    { new: true }
  )
  res.json(new ApiResponse(200, profile, "Education updated"))
})

export const deleteEducation = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { education: { _id: req.params.id } } },
    { new: true }
  )
  res.json(new ApiResponse(200, profile, "Education removed"))
})


/* ── Projects ── */
export const addProject = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { user: req.user._id },
    { $push: { projects: req.body } },
    { new: true }
  )
  res.json(new ApiResponse(200, profile, "Project added"))
})

export const updateProject = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { "projects._id": req.params.id },
    { $set: { "projects.$": req.body } },
    { new: true }
  )
  res.json(new ApiResponse(200, profile, "Project updated"))
})

export const deleteProject = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { projects: { _id: req.params.id } } },
    { new: true }
  )
  res.json(new ApiResponse(200, profile, "Project removed"))
})


/* ── Summary / Career / Personal / Diversity ── */
export const updateSummary = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { user: req.user._id },
    { profileSummary: req.body.summary },
    { new: true }
  )
  res.json(new ApiResponse(200, profile, "Summary updated"))
})

export const updateCareerProfile = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { user: req.user._id },
    { careerProfile: req.body },
    { new: true }
  )
  res.json(new ApiResponse(200, profile, "Career profile updated"))
})

export const updatePersonalDetails = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { user: req.user._id },
    { personalDetails: req.body },
    { new: true }
  )
  res.json(new ApiResponse(200, profile, "Personal details updated"))
})

export const updateDiversity = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOneAndUpdate(
    { user: req.user._id },
    { diversity: req.body },
    { new: true }
  )
  res.json(new ApiResponse(200, profile, "Diversity info updated"))
})


/* ── File uploads ── */
export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No file uploaded")

  await WorkerProfile.findOneAndUpdate(
    { user: req.user._id },
    {
      resume: {
        url: req.file.path,
        name: req.file.originalname,
        uploadedAt: new Date()
      }
    }
  )

  res.json(new ApiResponse(200, { path: req.file.path }, "Resume uploaded"))
})

export const uploadPhoto = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No file uploaded")

  await WorkerProfile.findOneAndUpdate(
    { user: req.user._id },
    { profilePhoto: req.file.path }
  )

  res.json(new ApiResponse(200, { path: req.file.path }, "Profile photo uploaded"))
})
=======

import {User} from "../models/user.model.js"
import {WorkerProfile} from "../models/workerProfile.model.js"


/* ================= Get Worker by user name================= */

export const getWorkerByUsername = async (req,res)=>{

 const {username} = req.params

 const user = await User.findOne({username})

 if(!user){
  return res.status(404).json({
   message:"Worker not found"
  })
 }

 const profile = await WorkerProfile.findOne({user:user._id})

 res.json({
  success:true,
  user:{
    fullName:user.fullName,
    username:user.username
  },
  profile
 })

}
/* ================= CREATE PROFILE ================= */

export const createProfile = async (req,res)=>{

 const exist = await WorkerProfile.findOne({user:req.user._id})

 if(exist){
  return res.json(exist)
 }

 const profile = await WorkerProfile.create({
  user:req.user._id
 })

 res.json({
  success:true,
  profile
 })
}



/* ================= GET PROFILE ================= */

export const getProfile = async (req,res)=>{

 const profile = await WorkerProfile.findOne({user:req.user._id})

 res.json(profile)
}



/* ================= HEADLINE ================= */

export const updateHeadline = async (req,res)=>{

 const profile = await WorkerProfile.findOneAndUpdate(
  {user:req.user._id},
  {resumeHeadline:req.body.headline},
  {new:true}
 )

 res.json(profile)
}



/* ================= SKILLS ================= */

export const updateSkills = async (req,res)=>{

 const profile = await WorkerProfile.findOneAndUpdate(
  {user:req.user._id},
  {$set:{keySkills:req.body.skills}},
  {new:true}
 )

 res.json(profile)
}



/* ================= IT SKILLS ================= */

export const addITSkill = async (req,res)=>{

 const profile = await WorkerProfile.findOneAndUpdate(
  {user:req.user._id},
  {$push:{itSkills:req.body}},
  {new:true}
 )

 res.json(profile)
}


export const updateITSkill = async (req,res)=>{

 const {id} = req.params

 const profile = await WorkerProfile.findOneAndUpdate(
  { "itSkills._id":id },
  {
   $set:{
    "itSkills.$.skill":req.body.skill,
    "itSkills.$.level":req.body.level
   }
  },
  {new:true}
 )

 res.json(profile)
}


export const deleteITSkill = async (req,res)=>{

 const {id} = req.params

 const profile = await WorkerProfile.findOneAndUpdate(
  {user:req.user._id},
  {$pull:{itSkills:{_id:id}}},
  {new:true}
 )

 res.json(profile)
}



/* ================= EMPLOYMENT ================= */

export const addEmployment = async (req,res)=>{

 const profile = await WorkerProfile.findOneAndUpdate(
  {user:req.user._id},
  {$push:{employment:req.body}},
  {new:true}
 )

 res.json(profile)
}


export const updateEmployment = async (req,res)=>{

 const {id} = req.params

 const profile = await WorkerProfile.findOneAndUpdate(
  {"employment._id":id},
  {
   $set:{
    "employment.$":req.body
   }
  },
  {new:true}
 )

 res.json(profile)
}


export const deleteEmployment = async (req,res)=>{

 const {id} = req.params

 const profile = await WorkerProfile.findOneAndUpdate(
  {user:req.user._id},
  {$pull:{employment:{_id:id}}},
  {new:true}
 )

 res.json(profile)
}



/* ================= EDUCATION ================= */

export const addEducation = async (req,res)=>{

 const profile = await WorkerProfile.findOneAndUpdate(
  {user:req.user._id},
  {$push:{education:req.body}},
  {new:true}
 )

 res.json(profile)
}


export const updateEducation = async (req,res)=>{

 const {id} = req.params

 const profile = await WorkerProfile.findOneAndUpdate(
  {"education._id":id},
  {
   $set:{
    "education.$":req.body
   }
  },
  {new:true}
 )

 res.json(profile)
}


export const deleteEducation = async (req,res)=>{

 const {id} = req.params

 const profile = await WorkerProfile.findOneAndUpdate(
  {user:req.user._id},
  {$pull:{education:{_id:id}}},
  {new:true}
 )

 res.json(profile)
}



/* ================= PROJECT ================= */

export const addProject = async (req,res)=>{

 const profile = await WorkerProfile.findOneAndUpdate(
  {user:req.user._id},
  {$push:{projects:req.body}},
  {new:true}
 )

 res.json(profile)
}


export const updateProject = async (req,res)=>{

 const {id} = req.params

 const profile = await WorkerProfile.findOneAndUpdate(
  {"projects._id":id},
  {
   $set:{
    "projects.$":req.body
   }
  },
  {new:true}
 )

 res.json(profile)
}


export const deleteProject = async (req,res)=>{

 const {id} = req.params

 const profile = await WorkerProfile.findOneAndUpdate(
  {user:req.user._id},
  {$pull:{projects:{_id:id}}},
  {new:true}
 )

 res.json(profile)
}



/* ================= SUMMARY ================= */

export const updateSummary = async (req,res)=>{

 const profile = await WorkerProfile.findOneAndUpdate(
  {user:req.user._id},
  {profileSummary:req.body.summary},
  {new:true}
 )

 res.json(profile)
}



/* ================= CAREER PROFILE ================= */

export const updateCareerProfile = async (req,res)=>{

 const profile = await WorkerProfile.findOneAndUpdate(
  {user:req.user._id},
  {careerProfile:req.body},
  {new:true}
 )

 res.json(profile)
}



/* ================= PERSONAL DETAILS ================= */

export const updatePersonalDetails = async (req,res)=>{

 const profile = await WorkerProfile.findOneAndUpdate(
  {user:req.user._id},
  {personalDetails:req.body},
  {new:true}
 )

 res.json(profile)
}



/* ================= DIVERSITY ================= */

export const updateDiversity = async (req,res)=>{

 const profile = await WorkerProfile.findOneAndUpdate(
  {user:req.user._id},
  {diversity:req.body},
  {new:true}
 )

 res.json(profile)
}



/* ================= RESUME ================= */

export const uploadResume = async (req,res)=>{

 const profile = await WorkerProfile.findOne({user:req.user._id})

 profile.resume = {
  url:req.file.path,
  name:req.file.originalname,
  uploadedAt:new Date()
 }

 await profile.save()

 res.json({
  success:true,
  message:"Resume updated"
 })
}



/* ================= PROFILE PHOTO ================= */

export const uploadPhoto = async (req,res)=>{

 const profile = await WorkerProfile.findOne({user:req.user._id})

 profile.profilePhoto = req.file.path

 await profile.save()

 res.json({
  success:true,
  message:"Profile photo updated"
 })
}
>>>>>>> 4a859b334291646d67fba3da3f4686b0ac99a4f6
