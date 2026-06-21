import express from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {
  sendMessage,
  getConversations,
  getMessages
} from "../controllers/message.controller.js"

const router = express.Router()

router.use(verifyJWT) // All message routes require authentication

router.post("/send", sendMessage)
router.get("/conversations", getConversations)
router.get("/history/:otherUserId", getMessages)

export default router
