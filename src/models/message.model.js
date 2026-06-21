import mongoose from "mongoose"

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job"
    },
    isRead: {
      type: Boolean,
      default: false
    },
    readAt: {
      type: Date
    }
  },
  { timestamps: true }
)

// Add compound indexes for fast conversation/chat queries
messageSchema.index({ sender: 1, receiver: 1 })
messageSchema.index({ receiver: 1, sender: 1 })

export const Message = mongoose.model("Message", messageSchema)
