import mongoose from "mongoose"

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    media: [
      {
        type: String // File paths for photos/files uploaded with the post
      }
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    likesCount: {
      type: Number,
      default: 0
    },
    commentsCount: {
      type: Number,
      default: 0
    },
    // Repost (share) fields
    isRepost: { type: Boolean, default: false },
    originalPost: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    repostContent: { type: String, trim: true },
    reposts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    repostsCount: { type: Number, default: 0 }
  },
  { timestamps: true }
)

// Add indexes for fast querying of post list and specific users' posts
postSchema.index({ createdAt: -1 })
postSchema.index({ author: 1, createdAt: -1 })
postSchema.index({ originalPost: 1 })

export const Post = mongoose.model("Post", postSchema)
