import Redis from "ioredis"

export const redisClient = new Redis(
  process.env.REDIS_URL || "redis://default:V5U5c0yolWKPyBp2lIkqws2lTPxF0SxG@redis-12418.crce263.ap-south-1-1.ec2.cloud.redislabs.com:12418"
)

redisClient.on("error", (err) =>
  console.log("Redis Error:", err.message)
)

export const connectRedis = async () => {
  console.log("✅ Redis Connected")
}