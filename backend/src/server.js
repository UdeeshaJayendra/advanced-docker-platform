const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const connectDatabase = require("./config/database");
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

  app.listen(PORT, () => {
    console.log(`TaskFlow API running on port ${PORT}`);
  });
};

startServer();