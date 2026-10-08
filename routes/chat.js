const router = require("express").Router();
const protect = require("../middleware/authMiddleware");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

// @POST /api/chat/conversation — get or create a conversation
router.post("/conversation", protect, async (req, res) => {
  try {
    const { receiverId } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, receiverId] },
      isGroup: false,
    }).populate("participants", "-password")
      .populate("lastMessage");

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user.id, receiverId],
      });
      conversation = await conversation.populate("participants", "-password");
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @GET /api/chat/conversations — get all conversations for logged-in user
router.get("/conversations", protect, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: { $in: [req.user.id] },
    })
      .populate("participants", "-password")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @GET /api/chat/messages/:conversationId — get messages in a conversation
router.get("/messages/:conversationId", protect, async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    }).populate("sender", "name avatar");

    // Mark messages as seen
    await Message.updateMany(
      { conversationId: req.params.conversationId, sender: { $ne: req.user.id }, seen: false },
      { $set: { seen: true } }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
