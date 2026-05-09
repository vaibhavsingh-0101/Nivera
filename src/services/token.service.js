import { redisClient } from "../config/redis.js"

export const blacklistToken = async (token, expiryInSeconds) => {
  await redisClient.set(token, "blacklisted", { EX: expiryInSeconds })
}

export const isTokenBlacklisted = async (token) => {
  const result = await redisClient.get(token)
  return result === "blacklisted"
  }
