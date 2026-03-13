import dotenv from "dotenv"
dotenv.config({ path:"./.env"});

import app from "./app.js"
import connectDB from "./config/connectDB.js"
import { connectRedis } from "./config/redis.js"

const PORT = process.env.PORT 
console.log(PORT)
const startServer = async () => {
  try {
    await connectDB()
    await connectRedis()

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error(" Server error:", error.message)
    process.exit(1)
  }
}

startServer()