// server.js
import dotenv from "dotenv"
dotenv.config()

// Dynamic imports run AFTER the above code executes
const { default: app } = await import("./app.js")
const { default: connectDB } = await import("../src/config/connectDB.js")
const { connectRedis } = await import("../src/config/redis.js")
const { seedPlans } = await import("../src/models/plan.model.js")

const PORT = process.env.PORT || 8000

const startServer = async () => {
  try {
    await connectDB()
    await connectRedis()
    await seedPlans()

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error("Server startup error:", error.message)
    process.exit(1)
  }
}

startServer()