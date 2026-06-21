import { Message } from "../models/message.model.js"
import { User } from "../models/user.model.js"
import { Job } from "../models/job.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse, asyncHandler } from "../utils/helpers.js"

/* ── Send a message (Approach or Reply) ── */
export const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, content, jobId } = req.body

  if (!receiverId || !content) {
    throw new ApiError(400, "Receiver ID and message content are required")
  }

  if (receiverId === req.user._id.toString()) {
    throw new ApiError(400, "You cannot send a message to yourself")
  }

  const receiver = await User.findById(receiverId)
  if (!receiver) {
    throw new ApiError(404, "Receiver not found")
  }

  // Optional: check if Job exists if jobId is provided
  if (jobId) {
    const job = await Job.findById(jobId)
    if (!job) {
      throw new ApiError(404, "Job not found")
    }
  }

  const message = await Message.create({
    sender: req.user._id,
    receiver: receiverId,
    content,
    job: jobId || undefined
  })

  res.status(201).json(new ApiResponse(201, message, "Message sent successfully"))
})

/* ── Get all active conversations/threads ── */
export const getConversations = asyncHandler(async (req, res) => {
  const messages = await Message.aggregate([
    {
      $match: {
        $or: [
          { sender: req.user._id },
          { receiver: req.user._id }
        ]
      }
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ["$sender", req.user._id] },
            "$receiver",
            "$sender"
          ]
        },
        latestMessage: { $first: "$$ROOT" }
      }
    },
    { $sort: { "latestMessage.createdAt": -1 } }
  ])

  const userIds = messages.map((m) => m._id)
  const users = await User.find({ _id: { $in: userIds } }).select("fullName username email role")
  const userMap = Object.fromEntries(users.map((u) => [u._id.toString(), u]))

  const conversations = messages.map((m) => ({
    otherUser: userMap[m._id.toString()] || null,
    latestMessage: m.latestMessage
  }))

  res.json(new ApiResponse(200, conversations, "Conversations retrieved"))
})

/* ── Get message history with another user ── */
export const getMessages = asyncHandler(async (req, res) => {
  const { otherUserId } = req.params

  const otherUser = await User.findById(otherUserId)
  if (!otherUser) {
    throw new ApiError(404, "Recipient not found")
  }

  // Mark all unread incoming messages from this user as read
  await Message.updateMany(
    { sender: otherUserId, receiver: req.user._id, isRead: false },
    { isRead: true, readAt: new Date() }
  )

  const history = await Message.find({
    $or: [
      { sender: req.user._id, receiver: otherUserId },
      { sender: otherUserId, receiver: req.user._id }
    ]
  })
    .sort({ createdAt: 1 })
    .populate("job", "title location salary")

  res.json(new ApiResponse(200, history, "Message history retrieved"))
})
