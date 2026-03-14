import multer from "multer"
import path from "path"

const storage = multer.diskStorage({

  destination:(req,file,cb)=>{

    if(file.fieldname === "resume"){
      cb(null,"uploads/resumes")
    }else{
      cb(null,"uploads/profile")
    }

  },

  filename:(req,file,cb)=>{

    const fileName = Date.now() + path.extname(file.originalname)

    cb(null,fileName)

  }

})

export const upload = multer({storage})