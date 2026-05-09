import multer from "multer"
import path from "path"
import fs from "fs"

// Ensure upload dirs exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}
ensureDir("uploads/resumes")
ensureDir("uploads/profile")
ensureDir("uploads/logos")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "resume") {
      cb(null, "uploads/resumes")
    } else if (file.fieldname === "logo") {
      cb(null, "uploads/logos")
    } else {
      cb(null, "uploads/profile")
    }
  },
  filename: (req, file, cb) => {
    const fileName = `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`
    cb(null, fileName)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "resume") {
    const allowed = [".pdf", ".doc", ".docx"]
    const ext = path.extname(file.originalname).toLowerCase()
    if (!allowed.includes(ext)) {
      return cb(new Error("Only PDF, DOC, DOCX files are allowed for resumes"))
    }
  }
  cb(null, true)
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }  // 5 MB
})