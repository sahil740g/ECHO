import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Track online users
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User joins with their profile
  socket.on("user:join", (user) => {
    onlineUsers.set(socket.id, user);
    io.emit("users:online", Array.from(onlineUsers.values()));
  });

  // Community Chat - Relay message to all clients
  socket.on("community:message", (message) => {
    // Server just relays; ID comes from Supabase
    io.emit("community:message", message);
  });

  // Direct Messages - Join conversation room
  socket.on("dm:join", (conversationId) => {
    socket.join(`dm:${conversationId}`);
  });

  // Direct Messages - Relay message to room
  socket.on("dm:message", ({ conversationId, message }) => {
    // Server just relays; ID comes from Supabase
    io.to(`dm:${conversationId}`).emit("dm:message", {
      conversationId,
      message,
    });
  });

  // Typing indicators
  socket.on("dm:typing", ({ conversationId, user }) => {
    socket.to(`dm:${conversationId}`).emit("dm:typing", user);
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(socket.id);
    io.emit("users:online", Array.from(onlineUsers.values()));
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});
