import { Queue } from "bullmq"
import { redisClient } from "../config/redis.js"

export const notificationQueue = new Queue("notifications", {
  connection: redisClient
})

export const enqueueEmail = async (type, payload) => {
  await notificationQueue.add(type, payload, {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 }
  })
}