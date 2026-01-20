import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";

import connectDB from "./config/database.js";

import eventRoutes from "./Routes/events.routes.js";
import blogRoutes from "./Routes/blog.routes.js";
import adminRoutes from "./Routes/admin.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// DB
connectDB();

/* ======================
   CORS (CORRECT)
   ====================== */
const allowedOrigins = [
  "http://localhost:5173",
  "https://biocrats.vercel.app",
  "https://biocrats.iiti.ac.in",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "x-admin-secret"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

/* ======================
   BASIC MIDDLEWARE
   ====================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ======================
   HEALTH
   ====================== */
app.get("/", (_req, res) => {
  res.json({ status: "OK", message: "Backend is running" });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "OK", message: "Server healthy" });
});

/* ======================
   ROUTES
   ====================== */
app.use("/api/blogs", blogRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/events", eventRoutes);

/* ======================
   404
   ====================== */
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

/* ======================
   ERROR HANDLER
   ====================== */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size too large (max 10MB)",
      });
    }
  }

  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

/* ======================
   START SERVER
   ====================== */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
