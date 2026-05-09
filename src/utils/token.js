import { redisClient } from "../config/redis.js"

export const blacklistToken = async (token, expiryInSeconds = 900) => {
  await redisClient.set(`bl:${token}`, "1", "EX", expiryInSeconds)
}

export const isTokenBlacklisted = async (token) => {
  const result = await redisClient.get(`bl:${token}`)
  return result === "1"
}