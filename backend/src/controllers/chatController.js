const Chat = require('../models/Chat');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

exports.getOrCreateChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const targetUser = await User.findById(userId);
  if (!targetUser) return res.status(404).json({ success: false, message: 'User not found' });

  let chat = await Chat.findOne({ participants: { $all: [req.user._id, userId] } });
  if (!chat) {
    chat = await Chat.create({ participants: [req.user._id, userId] });
  }

  return res.json({ success: true, chat });
});

exports.getUserChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({ participants: req.user._id })
    .populate('participants', 'name email profilePicture status lastSeen')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });

  return res.json({ success: true, chats });
});
