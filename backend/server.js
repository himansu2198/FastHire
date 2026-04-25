const http = require("http");
const app  = require("./src/app");
const { Server } = require("socket.io");
const path = require("path");
const express = require("express");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// ✅ Serve uploaded resumes as static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const io = new Server(server, {
  cors: { origin: "*" },
});

global.io = io;

io.on("connection", (socket) => {
  console.log("🔔 User connected:", socket.id);
  socket.on("join", (userId) => socket.join(userId));
  socket.on("disconnect", () => console.log("❌ User disconnected"));
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


