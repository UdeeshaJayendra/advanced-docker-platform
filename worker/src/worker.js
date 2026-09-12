const fs = require("fs");
const { createClient } = require("redis");

const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }

  if (process.env.REDIS_URL_FILE) {
    return fs.readFileSync(process.env.REDIS_URL_FILE, "utf8").trim();
  }

  throw new Error("REDIS_URL or REDIS_URL_FILE is required");
};

const redisClient = createClient({
  url: getRedisUrl()
});

redisClient.on("error", (error) => {
  console.error("Redis connection error:", error.message);
});

const startWorker = async () => {
  await redisClient.connect();

  console.log("TaskFlow worker connected to Redis");
  console.log("TaskFlow worker is waiting for jobs");

  while (true) {
    const job = await redisClient.brPop("taskflow:jobs", 0);

    if (job) {
      console.log(`Processing job: ${job.element}`);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log(`Job completed: ${job.element}`);
    }
  }
};

startWorker();