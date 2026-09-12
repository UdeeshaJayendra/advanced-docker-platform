const fs = require("fs");
const mongoose = require("mongoose");

const getMongoUri = () => {
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI;
  }

  if (process.env.MONGODB_URI_FILE) {
    return fs.readFileSync(process.env.MONGODB_URI_FILE, "utf8").trim();
  }

  throw new Error("MONGODB_URI or MONGODB_URI_FILE is required");
};

const connectDatabase = async () => {
  try {
    const mongoUri = getMongoUri();

    await mongoose.connect(mongoUri);

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDatabase;