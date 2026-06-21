import { Post } from "../models/post.model.js"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse, asyncHandler } from "../utils/helpers.js"

/* ── Create Post ── */
export const createPost = asyncHandler(async (req, res) => {
  const { content } = req.body
  if (!content) throw new ApiError(400, "Post content is required")

  const mediaFiles = req.files ? req.files.map((file) => file.path) : []

  const post = await Post.create({
    author: req.user._id,
    content,
    media: mediaFiles
  })

  res.status(201).json(new ApiResponse(201, post, "Post created successfully"))
})

/* ── Get Paginated Social Feed ── */
export const getFeed = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10

  const [posts, total] = await Promise.all([
    Post.find()
      .populate("author", "fullName username role email")
      .populate({
        path: "originalPost",
        populate: {
          path: "author",
          select: "fullName username role email"
        }
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Post.countDocuments()
  ])

  // Attach isLiked field for client convenience
  const currentUserId = req.user._id.toString()
  const enrichedPosts = posts.map((post) => {
    const likesList = post.likes ? post.likes.map((id) => id.toString()) : []
    return {
      ...post,
      hasLiked: likesList.includes(currentUserId),
      likes: undefined // Hide full list of IDs for speed
    }
  })

  res.json(new ApiResponse(200, {
    posts: enrichedPosts,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) }
  }, "Feed retrieved"))
})

/* ── Get Post by ID ── */
export const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("author", "fullName username role email")
    .populate({
      path: "originalPost",
      populate: {
        path: "author",
        select: "fullName username role email"
      }
    })
    .lean()

  if (!post) throw new ApiError(404, "Post not found")

  const likesList = post.likes ? post.likes.map((id) => id.toString()) : []
  post.hasLiked = likesList.includes(req.user._id.toString())
  post.likes = undefined

  res.json(new ApiResponse(200, post, "Post retrieved"))
})

/* ── Repost (share) a Post ── */
export const repostPost = asyncHandler(async (req, res) => {
  const { id: postId } = req.params
  const { repostContent } = req.body

  const originalPost = await Post.findById(postId)
  if (!originalPost) throw new ApiError(404, "Original post not found")

  // Create a new post that is a repost of the original
  const repost = await Post.create({
    author: req.user._id,
    content: repostContent || "Shared a post", // fallback if no commentary
    isRepost: true,
    originalPost: originalPost._id,
    repostContent: repostContent || ""
  })

  // Increment original post's repostsCount and add user to reposts array if not already there
  const currentUserId = req.user._id.toString()
  const repostsList = originalPost.reposts ? originalPost.reposts.map((id) => id.toString()) : []

  if (!repostsList.includes(currentUserId)) {
    originalPost.reposts.push(req.user._id)
  }
  originalPost.repostsCount = (originalPost.repostsCount || 0) + 1
  await originalPost.save()

  // Return the populated repost
  const populatedRepost = await Post.findById(repost._id)
    .populate("author", "fullName username role email")
    .populate({
      path: "originalPost",
      populate: {
        path: "author",
        select: "fullName username role email"
      }
    })

  res.status(201).json(new ApiResponse(201, populatedRepost, "Post reposted successfully"))
})

/* ── Delete Post ── */
export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
  if (!post) throw new ApiError(404, "Post not found")

  if (post.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this post")
  }

  await post.deleteOne()
  // Clean up all associated comments
  await Comment.deleteMany({ post: post._id })

  res.json(new ApiResponse(200, {}, "Post and its comments deleted successfully"))
})

/* ── Toggle Like/Unlike on a Post ── */
export const toggleLikePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
  if (!post) throw new ApiError(404, "Post not found")

  const currentUserId = req.user._id.toString()
  const likesList = post.likes ? post.likes.map((id) => id.toString()) : []
  const hasLiked = likesList.includes(currentUserId)

  if (hasLiked) {
    // Unlike
    post.likes = post.likes.filter((id) => id.toString() !== currentUserId)
  } else {
    // Like
    post.likes.push(req.user._id)
  }

  post.likesCount = post.likes.length
  await post.save()

  res.json(new ApiResponse(200, {
    likesCount: post.likesCount,
    hasLiked: !hasLiked
  }, hasLiked ? "Post unliked" : "Post liked"))
})

/* ── Add Comment to a Post ── */
export const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body
  const { id: postId } = req.params

  if (!content) throw new ApiError(400, "Comment content is required")

  const post = await Post.findById(postId)
  if (!post) throw new ApiError(404, "Post not found")

  const comment = await Comment.create({
    post: postId,
    author: req.user._id,
    content
  })

  // Increment comments count
  await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } })

  res.status(201).json(new ApiResponse(201, comment, "Comment added successfully"))
})

/* ── Get Comments for a Post ── */
export const getPostComments = asyncHandler(async (req, res) => {
  const { id: postId } = req.params
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10

  const [comments, total] = await Promise.all([
    Comment.find({ post: postId })
      .populate("author", "fullName username role")
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Comment.countDocuments({ post: postId })
  ])

  res.json(new ApiResponse(200, {
    comments,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) }
  }, "Comments retrieved"))
})

/* ── Delete a Comment ── */
export const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params

  const comment = await Comment.findById(commentId)
  if (!comment) throw new ApiError(404, "Comment not found")

  const post = await Post.findById(comment.post)

  const isCommentAuthor = comment.author.toString() === req.user._id.toString()
  const isPostAuthor = post && post.author.toString() === req.user._id.toString()

  if (!isCommentAuthor && !isPostAuthor) {
    throw new ApiError(403, "You are not authorized to delete this comment")
  }

  await comment.deleteOne()

  // Decrement comments count
  if (post) {
    await Post.findByIdAndUpdate(post._id, { $inc: { commentsCount: -1 } })
  }

  res.json(new ApiResponse(200, {}, "Comment deleted successfully"))
})
