const express = require("express");
const cors = require("cors");
require("dotenv").config();


const app = express();
const { sendTestEmail } = require("./config/email");
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

app.post("/api/email-test", async (req, res) => {
  try {
    const info = await sendTestEmail();

    res.status(202).json({
      message: "Test email sent successfully",
      messageId: info.messageId
    });
  } catch (error) {
    console.error("Email sending failed:", error.message);

    res.status(500).json({
      message: "Email sending failed"
    });
  }
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

app.post("/api/jobs", async (req, res) => {
  const job = {
    type: "task-created",
    timestamp: new Date().toISOString()
  };

  await redisClient.lPush("taskflow:jobs", JSON.stringify(job));

  res.status(202).json({
    message: "Job queued successfully",
    job
  });
});

startServer();