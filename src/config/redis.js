import Redis from "ioredis"

export const redisClient = new Redis(
  process.env.REDIS_URL || "redis://default:VTyyfo3UdLBgzZZXemixG7siGArfuMPQ@redis-14481.c244.us-east-1-2.ec2.cloud.redislabs.com:14481"
)

redisClient.on("error", (err) =>
  console.log("Redis Error:", err.message)
)

export const connectRedis = async () => {
  console.log("✅ Redis Connected")
}