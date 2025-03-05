import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("connect", () => console.log("Connected to Redis!"));
redisClient.on("ready", () => console.log("Redis ready!"));
redisClient.on("reconnecting", () => console.log("Reconnecting to Redis..."));
redisClient.on("end", () => console.log("Redis connection closed."));
redisClient.on("error", (err) => console.error("Redis error:", err));

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
  }
})();

export default redisClient;
