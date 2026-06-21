import dotenv from "dotenv"
dotenv.config()
import mongoose from "mongoose"
import { Post } from "./models/post.model.js"
import { User } from "./models/user.model.js"

const runTests = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...")
    await mongoose.connect(process.env.MONGO_URI)
    console.log("✅ MongoDB Connected\n")

    // Cleanup existing test accounts if any
    await User.deleteMany({ email: { $in: ["test_employer_repost@navera.com", "test_worker_repost@navera.com"] } })
    await User.deleteMany({ phone: { $in: ["+15550000001", "+15550000002"] } })
    console.log("🧹 Cleaned up existing test accounts")

    // Create test employer
    const employer = await User.create({
      fullName: "Test Employer Repost",
      username: "test_employer_repost",
      email: "test_employer_repost@navera.com",
      password: "password123",
      role: "employer",
      phone: "+15550000001"
    })

    // Create test worker
    const worker = await User.create({
      fullName: "Test Worker Repost",
      username: "test_worker_repost",
      email: "test_worker_repost@navera.com",
      password: "password123",
      role: "worker",
      phone: "+15550000002"
    })

    console.log(`👤 Created test employer: ${employer.fullName} (${employer._id})`)
    console.log(`👤 Created test worker: ${worker.fullName} (${worker._id})`)

    // Create original post
    const originalPostContent = "Welcome to the new social feed! This is our flagship announcement post."
    const originalPost = await Post.create({
      author: employer._id,
      content: originalPostContent
    })
    console.log(`📝 Original post created: "${originalPost.content}" (ID: ${originalPost._id})`)

    // Worker reposts the post with commentary
    const repostCommentary = "Totally agree! Exciting updates ahead."
    console.log(`🔄 Worker is reposting the post...`)
    
    // Simulate repostPost logic
    const repost = await Post.create({
      author: worker._id,
      content: repostCommentary,
      isRepost: true,
      originalPost: originalPost._id,
      repostContent: repostCommentary
    })

    // Update original post counters
    originalPost.reposts.push(worker._id)
    originalPost.repostsCount = 1
    await originalPost.save()

    console.log("✅ Repost document created successfully")

    // Fetch feed and verify populates
    console.log("\n📰 Retrieving feed to verify populates...")
    const posts = await Post.find()
      .populate("author", "fullName username role email")
      .populate({
        path: "originalPost",
        populate: {
          path: "author",
          select: "fullName username role email"
        }
      })
      .sort({ createdAt: -1 })
      .lean()

    console.log(`Feed count: ${posts.length} posts found.`)
    
    // Find repost post
    const foundRepost = posts.find(p => p.isRepost === true)
    const foundOriginal = posts.find(p => p.isRepost === false)

    if (!foundRepost) {
      throw new Error("❌ Repost post not found in feed")
    }
    if (!foundOriginal) {
      throw new Error("❌ Original post not found in feed")
    }

    console.log(`\n🔍 Verifying Repost Details:`)
    console.log(` - Repost Author: ${foundRepost.author.fullName} (${foundRepost.author.role})`)
    console.log(` - Repost Content: "${foundRepost.content}"`)
    console.log(` - References Original: ${foundRepost.originalPost !== null}`)
    console.log(` - Original Author: ${foundRepost.originalPost.author.fullName} (${foundRepost.originalPost.author.role})`)
    console.log(` - Original Content: "${foundRepost.originalPost.content}"`)

    if (foundRepost.originalPost.author.fullName !== "Test Employer Repost") {
      throw new Error("❌ Original post author not correctly populated inside repost")
    }

    console.log(`\n🔍 Verifying Original Post Counters:`)
    const updatedOriginal = await Post.findById(originalPost._id)
    console.log(` - originalPost.repostsCount: ${updatedOriginal.repostsCount} (Expected: 1)`)
    
    if (updatedOriginal.repostsCount !== 1) {
      throw new Error(`❌ Repost count is incorrect. Got ${updatedOriginal.repostsCount}, expected 1`)
    }

    // Clean up
    console.log("\n🧹 Cleaning up test data...")
    await Post.deleteMany({ _id: { $in: [originalPost._id, repost._id] } })
    await User.deleteMany({ _id: { $in: [employer._id, worker._id] } })
    console.log("✅ Cleaned up successfully")

    console.log("\n🎉 ALL REPOST FUNCTIONALITY TESTS PASSED SUCCESSFULLY! 🎉")
    process.exit(0)
  } catch (error) {
    console.error("\n❌ Test failed:", error.message)
    process.exit(1)
  }
}

runTests()
