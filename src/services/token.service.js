import { redisClient } from "../config/redis.js"

<<<<<<< HEAD
export const blacklistToken = async (token, expiryInSeconds = 900) => {
  await redisClient.set(`bl:${token}`, "1", "EX", expiryInSeconds)
}

export const isTokenBlacklisted = async (token) => {
  const result = await redisClient.get(`bl:${token}`)
  return result === "1"
}
=======
export const blacklistToken = async (token, expiryInSeconds) => {
  await redisClient.set(token, "blacklisted", { EX: expiryInSeconds })
}

export const isTokenBlacklisted = async (token) => {
  const result = await redisClient.get(token)
  return result === "blacklisted"
  }
>>>>>>> 4a859b334291646d67fba3da3f4686b0ac99a4f6
