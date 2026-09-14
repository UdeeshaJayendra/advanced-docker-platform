const express = require("express");
const cors = require("cors");
require("dotenv").config();

const Task = require("./models/Task");
const { sendTestEmail } = require("./config/email");
const {
  connectDatabase,
  disconnectDatabase
} = require("./config/database");
const { redisClient, connectRedis } = require("./config/redis");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/* -------------------- Basic Routes -------------------- */

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

/* -------------------- Task CRUD -------------------- */

// Get all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error("Failed to fetch tasks:", error.message);

    res.status(500).json({
      message: "Failed to fetch tasks"
    });
  }
});

// Get one task
app.get("/api/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.json(task);
  } catch (error) {
    console.error("Failed to fetch task:", error.message);

    res.status(400).json({
      message: "Invalid task ID"
    });
  }
});

// Create task
app.post("/api/tasks", async (req, res) => {
  try {
    const { title, status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required"
      });
    }

    const task = await Task.create({
      title: title.trim(),
      status
    });

    // Queue background job
    const job = {
      type: "task-created",
      taskId: task._id.toString(),
      title: task.title,
      timestamp: new Date().toISOString()
    };

    await redisClient.lPush(
      "taskflow:jobs",
      JSON.stringify(job)
    );

    res.status(201).json(task);
  } catch (error) {
    console.error("Failed to create task:", error.message);

    res.status(400).json({
      message: "Failed to create task"
    });
  }
});

// Update task
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const { title, status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required"
      });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title: title.trim(),
        status
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.json(task);
  } catch (error) {
    console.error("Failed to update task:", error.message);

    res.status(400).json({
      message: "Failed to update task"
    });
  }
});

// Delete task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.json({
      message: "Task deleted successfully"
    });
  } catch (error) {
    console.error("Failed to delete task:", error.message);

    res.status(400).json({
      message: "Failed to delete task"
    });
  }
});

/* -------------------- Email Test -------------------- */

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

/* -------------------- Redis Cache Test -------------------- */

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

/* -------------------- Background Job Test -------------------- */

app.post("/api/jobs", async (req, res) => {
  const job = {
    type: "task-created",
    timestamp: new Date().toISOString()
  };

  await redisClient.lPush(
    "taskflow:jobs",
    JSON.stringify(job)
  );

  res.status(202).json({
    message: "Job queued successfully",
    job
  });
});

/* -------------------- Server Startup -------------------- */

let server;

const startServer = async () => {
  await connectDatabase();
  await connectRedis();

  server = app.listen(PORT, () => {
    console.log(`TaskFlow API running on port ${PORT}`);
  });
};

startServer();

/* -------------------- Graceful Shutdown -------------------- */

const gracefulShutdown = async (signal) => {
  console.log(
    `${signal} received. Starting graceful shutdown...`
  );

  if (server) {
    server.close(() => {
      console.log("HTTP server closed");
    });
  }

  try {
    await redisClient.quit();
    console.log("Redis connection closed");
  } catch (error) {
    console.error(
      "Redis shutdown error:",
      error.message
    );
  }

  try {
    await disconnectDatabase();
  } catch (error) {
    console.error(
      "MongoDB shutdown error:",
      error.message
    );
  }

  process.exit(0);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));