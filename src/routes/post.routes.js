import express from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/upload.middleware.js"
import {
  createPost,
  getFeed,
  getPostById,
  deletePost,
  toggleLikePost,
  addComment,
  getPostComments,
  deleteComment,
  repostPost
} from "../controllers/post.controller.js"

const router = express.Router()

router.use(verifyJWT) // All social feed actions require authentication

router.post("/", upload.array("media", 5), createPost) // Supports up to 5 media uploads
router.get("/", getFeed)
router.get("/:id", getPostById)
router.delete("/:id", deletePost)
router.post("/:id/like", toggleLikePost)
router.post("/:id/repost", repostPost)

router.post("/:id/comments", addComment)
router.get("/:id/comments", getPostComments)
router.delete("/comments/:commentId", deleteComment)

export default router
