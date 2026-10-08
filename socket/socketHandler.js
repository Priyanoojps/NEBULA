const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

const onlineUsers = new Map(); // userId -> socketId

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // User comes online
    socket.on("user:online", (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit("users:online", Array.from(onlineUsers.keys()));
      console.log(`👤 User online: ${userId}`);
    });

    // Join a conversation room
    socket.on("conversation:join", (conversationId) => {
      socket.join(conversationId);
      console.log(`📩 Socket ${socket.id} joined room: ${conversationId}`);
    });

    // Leave a conversation room
    socket.on("conversation:leave", (conversationId) => {
      socket.leave(conversationId);
      console.log(`📤 Socket ${socket.id} left room: ${conversationId}`);
    });

    // Send a message
    socket.on("message:send", async ({ conversationId, senderId, content }) => {
      console.log("📨 MESSAGE RECEIVED:", { conversationId, senderId, content });
      try {
        // Save to DB
        const message = await Message.create({
          conversationId,
          sender: senderId,
          content,
        });

        // Update last message in conversation
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: message._id,
          updatedAt: new Date(),
        });

        // Populate sender info
        const populated = await message.populate("sender", "name avatar");
        console.log("✅ MESSAGE SAVED:", populated);

        // Emit to everyone in the room
        io.to(conversationId).emit("message:receive", populated);
      } catch (error) {
        socket.emit("error", { message: "Failed to send message" });
        console.error("message:send error:", error.message);
      }
    });

    // Typing indicators
    socket.on("typing:start", ({ conversationId, userId, userName }) => {
      socket.to(conversationId).emit("typing:start", { userId, userName });
    });

    socket.on("typing:stop", ({ conversationId, userId }) => {
      socket.to(conversationId).emit("typing:stop", { userId });
    });

    // Message seen
    socket.on("message:seen", async ({ conversationId, userId }) => {
      await Message.updateMany(
        { conversationId, sender: { $ne: userId }, seen: false },
        { $set: { seen: true } }
      );
      io.to(conversationId).emit("message:seen", { conversationId, userId });
    });

    // Disconnect
    socket.on("disconnect", () => {
      onlineUsers.forEach((sockId, userId) => {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`👤 User offline: ${userId}`);
        }
      });
      io.emit("users:online", Array.from(onlineUsers.keys()));
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });
};
