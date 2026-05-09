import { Worker } from "bullmq"
import { redisClient } from "../config/redis.js"
import {
  sendApplicationEmail,
  sendStatusUpdateEmail,
  sendVerificationEmail
} from "../services/email.service.js"

const worker = new Worker(
  "notifications",
  async (job) => {
    const { type, data } = job

    switch (job.name) {
      case "application_received":
        await sendApplicationEmail(data.workerEmail, data.jobTitle, data.companyName)
        break

      case "status_updated":
        await sendStatusUpdateEmail(data.workerEmail, data.jobTitle, data.status)
        break

      case "verification_email":
        await sendVerificationEmail(data.email, data.token)
        break

      default:
        console.log("Unknown notification type:", job.name)
    }
  },
  { connection: redisClient }
)

worker.on("completed", (job) => {
  console.log(`✅ Notification [${job.name}] completed`)
})

worker.on("failed", (job, err) => {
  console.error(`❌ Notification [${job.name}] failed:`, err.message)
})

console.log("🔔 Notification worker started")