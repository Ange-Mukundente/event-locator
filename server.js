const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const http = require("http");
const { Server } = require("socket.io");
const i18n = require('i18n');

// Configure i18n
i18n.configure({
  locales: ['en', 'es', 'fr', 'de'], // supported locales
  directory: __dirname + '/locales', // path to locale files
  defaultLocale: 'en', // default locale
  cookie: 'lang', // cookie name to store locale
  autoReload: true, // reload translations when files change
  updateFiles: false, // don't create missing locale files automatically
});

// Initialize for use in app


dotenv.config();

const app = express();
app.use(express.json());
app.use(i18n.init);
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
