const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes        = require("./routes/authRoutes");
const jobRoutes         = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const notificationRoutes= require("./routes/notificationRoutes");
const profileRoutes     = require("./routes/profileRoutes");

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Serve uploaded files BEFORE API routes and fallback ────────────────────
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../../uploads"), {
    setHeaders: (res) => {
      res.set("Content-Type", "application/pdf");
    },
  })
);

// ── Database ────────────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// ── Test route ──────────────────────────────────────────────────────────────
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend is working",
    timestamp: new Date().toISOString(),
  });
});

// ── API routes ──────────────────────────────────────────────────────────────
app.use("/api/auth",         authRoutes);
app.use("/api/jobs",         jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/notifications",notificationRoutes);
app.use("/api/profile",      profileRoutes);

// ── Serve React build ───────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

// ── React fallback ──────────────────────────────────────────────────────────
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

module.exports = app;