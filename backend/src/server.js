const express = require("express");
const cors = require("cors");
require("dotenv").config();


const app = express();
const connectDatabase = require("./config/database");
const { redisClient, connectRedis } = require("./config/redis");
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "TaskFlow API is running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "taskflow-backend"
  });
});

app.listen(PORT, () => {
  console.log(`TaskFlow API running on port ${PORT}`);
});

const startServer = async () => {
  await connectDatabase();
  await connectRedis();

  app.listen(PORT, () => {
    console.log(`TaskFlow API running on port ${PORT}`);
  });
};

app.get("/api/cache-test", async (req, res) => {
  const key = "taskflow:cache-test";

  const cachedValue = await redisClient.get(key);

  if (cachedValue) {
    return res.json({
      source: "redis",
      value: cachedValue
    });
  }

  const value = `TaskFlow cache created at ${new Date().toISOString()}`;

  await redisClient.set(key, value, {
    EX: 60
  });

  res.json({
    source: "application",
    value
  });
});

startServer();