
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