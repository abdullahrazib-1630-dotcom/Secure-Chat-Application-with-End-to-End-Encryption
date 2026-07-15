const Chat = require('../models/Chat');
const Message = require('../models/Message');
const asyncHandler = require('../utils/asyncHandler');

exports.sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, encryptedMessage, iv, authTag, algorithm } = req.body;

  let chat = await Chat.findOne({ participants: { $all: [req.user._id, receiverId] } });
  if (!chat) chat = await Chat.create({ participants: [req.user._id, receiverId] });

  const message = await Message.create({
    chat: chat._id,
    sender: req.user._id,
    receiver: receiverId,
    encryptedMessage,
    iv,
    authTag,
    algorithm,
  });

  chat.lastMessage = message._id;
  await chat.save();

  return res.status(201).json({ success: true, message });
});

exports.getMessagesForChat = asyncHandler(async (req, res) => {
  const { id: chatId } = req.params;
  const messages = await Message.find({ chat: chatId }).sort({ timestamp: 1 });
  return res.json({ success: true, messages });
});

exports.markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const message = await Message.findOneAndUpdate(
    { _id: id, receiver: req.user._id },
    { readStatus: true },
    { new: true }
  );

  if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
  return res.json({ success: true, message });
});
