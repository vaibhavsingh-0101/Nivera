import dotenv from "dotenv"
dotenv.config({ path: "./.env" })

import app from "./app.js"
import connectDB from "../src/config/connectDB.js"
import { connectRedis } from "../src/config/redis.js"
import { seedPlans } from "../src/models/plan.model.js"

const PORT = process.env.PORT || 8000

const startServer = async () => {
  try {
    await connectDB()
    await connectRedis()
    await seedPlans()   // seed Basic/Standard/Premium if not present

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error("Server startup error:", error.message)
    process.exit(1)
  }
}

startServer()