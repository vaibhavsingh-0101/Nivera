import mongoose from "mongoose"

const workerProfileSchema = new mongoose.Schema({

  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
    unique:true
  },

  profilePhoto:String,

  resume:{
    url:String,
    name:String,
    uploadedAt:Date
  },

  resumeHeadline:String,

  keySkills:[String],

  itSkills:[
    {
      skill:String,
      level:String
    }
  ],

  employment:[
    {
      company:String,
      role:String,
      startDate:Date,
      endDate:Date,
      description:String
    }
  ],

  education:[
    {
      level:String,
      degree:String,
      institute:String,
      startYear:Number,
      endYear:Number,
      percentage:String
    }
  ],

  projects:[
    {
      title:String,
      description:String,
      technologies:[String],
      link:String
    }
  ],

  profileSummary:String,

  accomplishments:{
    onlineProfiles:[String],
    workSamples:[String],
    publications:[String],
    presentations:[String],
    patents:[String],
    certifications:[String]
  },

  careerProfile:{
    industry:String,
    department:String,
    desiredJobType:String,
    employmentType:String,
    preferredShift:String,
    preferredLocation:String,
    expectedSalary:String
  },

  personalDetails:{
    gender:String,
    maritalStatus:String,
    dateOfBirth:Date,
    address:String,
    workPermit:String
  },

  diversity:{
    disabilityStatus:String,
    militaryExperience:String,
    careerBreak:String
  }

},{timestamps:true})

export const WorkerProfile = mongoose.model("WorkerProfile",workerProfileSchema)