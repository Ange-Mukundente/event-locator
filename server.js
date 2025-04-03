const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, { cors: { origin: "*" } });
app.set("io", io);

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => console.log("Client disconnected"));
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

const PORT = process.env.PORT || 4000;

// Start the server only if not in test mode
if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export `app` for testing, and `server` for live use
module.exports = { app, server };
