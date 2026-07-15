const User = require('../models/User');
const Message = require('../models/Message');
const asyncHandler = require('../utils/asyncHandler');

exports.getProfile = asyncHandler(async (req, res) => {
  return res.json({ success: true, profile: req.user });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, profilePicture, status } = req.body;
  const user = await User.findById(req.user._id);

  if (name) user.name = String(name).trim();
  if (profilePicture !== undefined) user.profilePicture = String(profilePicture);
  if (status && ['online', 'offline', 'away'].includes(status)) user.status = status;

  await user.save();
  return res.json({ success: true, profile: user });
});

exports.searchUsers = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const users = await User.find({
    _id: { $ne: req.user._id },
    $or: [{ name: { $regex: q, $options: 'i' } }, { email: { $regex: q, $options: 'i' } }],
  })
    .limit(20)
    .select('name email profilePicture status lastSeen');

  return res.json({ success: true, users });
});

exports.getDashboard = asyncHandler(async (req, res) => {
  const onlineUsers = await User.countDocuments({ status: 'online' });
  const unreadMessages = await Message.countDocuments({ receiver: req.user._id, readStatus: false });
  const recentChats = await Message.find({ $or: [{ sender: req.user._id }, { receiver: req.user._id }] })
    .sort({ timestamp: -1 })
    .limit(10)
    .populate('sender receiver', 'name email profilePicture');

  return res.json({
    success: true,
    dashboard: {
      onlineUsers,
      unreadMessages,
      recentChats,
      securityStatus: 'Protected by JWT + bcrypt + rate limiting + Helmet + E2EE payload storage',
      lastLogin: req.session?.lastLoginAt || null,
    },
  });
});
