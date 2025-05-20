import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import groupRoutes from "./routes/group.route.js";

import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer"; // for handling file uploads
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;

// middlewares
app.use(express.json({ limit: "50mb" })); // Increase the JSON payload size limit (50MB)
app.use(cookieParser());

// using cors for showing the cors_policy
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Set up storage configuration for multer (if you are uploading files)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique file names
  },
});

// Set file upload size limit for multer (50MB here)
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB file size limit
});

// Example of handling file upload route
app.post("/upload", upload.single("file"), (req, res) => {
  res.send("File uploaded successfully!");
});

// route handling
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/groups", groupRoutes);

server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
  connectDB();
});
