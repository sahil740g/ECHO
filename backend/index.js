import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import "dotenv/config";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Authentication Endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // 1. Verify credentials with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    if (!data.user) {
      return res.status(401).json({ error: "User not found" });
    }

    // 2. Generate Custom JWT
    const token = jwt.sign(
      { userId: data.user.id, email: data.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 3. Return Token, User Info, and Supabase Session
    return res.json({
      message: "Login successful",
      token,
      user: {
        id: data.user.id,
        email: data.user.email,
        metadata: data.user.user_metadata,
      },
      session: data.session, // Include Supabase session for frontend RLS
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Authentication token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    req.user = user; // user = { userId, email, iat, exp }
    next();
  });
};

// Protected Route Example: Verify Token
app.get("/verify", authenticateToken, (req, res) => {
  // Return user with 'id' field instead of 'userId' for frontend consistency
  res.json({
    message: "Token is valid",
    user: {
      id: req.user.userId,
      email: req.user.email
    }
  });
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

  // Stats request - Send online user count
  socket.on("stats:request", () => {
    socket.emit("stats:response", {
      onlineUsers: onlineUsers.size
    });
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
