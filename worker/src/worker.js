const fs = require("fs");
const { createClient } = require("redis");
const { sendJobEmail } = require("./email");

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

let shuttingDown = false;

const startWorker = async () => {
  await redisClient.connect();

  console.log("TaskFlow worker connected to Redis");
  console.log("TaskFlow worker is waiting for jobs");

  while (!shuttingDown) {
    const job = await redisClient.brPop("taskflow:jobs", 2);

    if (shuttingDown) {
      break;
    }

    if (job) {
      try {
        const parsedJob = JSON.parse(job.element);

        console.log(`Processing job: ${job.element}`);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        await sendJobEmail(parsedJob);

        console.log(`Job completed: ${job.element}`);
      } catch (error) {
        console.error("Job processing failed:", error.message);
      }
    }
  }
};

const gracefulShutdown = async (signal) => {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  console.log(`${signal} received. Starting worker shutdown...`);

  try {
    if (redisClient.isOpen) {
      await redisClient.quit();
      console.log("Worker Redis connection closed");
    }
  } catch (error) {
    console.error("Worker Redis shutdown error:", error.message);
  }

  process.exit(0);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

startWorker().catch((error) => {
  console.error("Worker startup failed:", error.message);
  process.exit(1);
});
