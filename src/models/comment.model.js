import mongoose from "mongoose"

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
)

// Index comments by post and creation time
commentSchema.index({ post: 1, createdAt: 1 })

export const Comment = mongoose.model("Comment", commentSchema)
