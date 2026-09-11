const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379"
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