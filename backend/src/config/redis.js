const fs = require("fs");
const { createClient } = require("redis");

const getRedisUrl = () => {
  if (process.env.REDIS_URL_FILE) {
    return fs.readFileSync(process.env.REDIS_URL_FILE, "utf8").trim();
  }

  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }

  throw new Error("REDIS_URL or REDIS_URL_FILE is required");
};

const redisClient = createClient({
  url: getRedisUrl()
});

redisClient.on("error", (error) => {
  console.error("Redis connection error:", error.message);
});

const connectRedis = async () => {
  await redisClient.connect();
  console.log("Redis connected");
};

module.exports = {
  redisClient,
  connectRedis
};