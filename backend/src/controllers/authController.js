const crypto = require('crypto');
const { matchedData } = require('express-validator');
const User = require('../models/User');
const Session = require('../models/Session');
const asyncHandler = require('../utils/asyncHandler');
const { signToken } = require('../utils/token');
const { issueCsrfToken } = require('../middleware/csrf');

const cookieConfig = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000,
};

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  profilePicture: user.profilePicture,
  status: user.status,
  lastSeen: user.lastSeen,
  createdAt: user.createdAt,
});

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = matchedData(req, { locations: ['body'] });

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ success: false, message: 'Email already in use' });

  const user = await User.create({ name, email, password, lastSeen: new Date() });
  const { token, jti } = signToken({ userId: user._id.toString() });

  await Session.create({
    user: user._id,
    jti,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  res.cookie('token', token, cookieConfig);
  issueCsrfToken(res);

  return res.status(201).json({ success: true, user: sanitizeUser(user) });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password, rememberMe } = matchedData(req, { locations: ['body'] });

  const user = await User.findOne({ email }).select('+password');
  if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

  const sessionDuration = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  const { token, jti } = signToken({ userId: user._id.toString() });

  await Session.create({ user: user._id, jti, expiresAt: new Date(Date.now() + sessionDuration), lastLoginAt: new Date() });

  user.status = 'online';
  user.lastSeen = new Date();
  await user.save();

  res.cookie('token', token, { ...cookieConfig, maxAge: sessionDuration });
  issueCsrfToken(res);
  return res.json({ success: true, user: sanitizeUser(user) });
});

exports.logout = asyncHandler(async (req, res) => {
  if (req.session) {
    req.session.isRevoked = true;
    await req.session.save();
  }

  if (req.user) {
    req.user.status = 'offline';
    req.user.lastSeen = new Date();
    await req.user.save();
  }

  res.clearCookie('token');
  res.clearCookie('csrfToken');
  return res.json({ success: true, message: 'Logged out successfully' });
});

exports.getCurrentUser = asyncHandler(async (req, res) => {
  return res.json({ success: true, user: sanitizeUser(req.user) });
});

exports.getCsrfToken = asyncHandler(async (req, res) => {
  const token = issueCsrfToken(res);
  return res.json({ success: true, csrfToken: token });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = matchedData(req, { locations: ['body'] });
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ success: true, message: 'If account exists, reset instructions generated.' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  return res.json({
    success: true,
    message: 'Local reset token generated for testing (no email service used).',
    resetToken,
  });
});

exports.changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = matchedData(req, { locations: ['body'] });
  const user = await User.findById(req.user._id).select('+password');

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) return res.status(400).json({ success: false, message: 'Old password is incorrect' });

  user.password = newPassword;
  await user.save();

  return res.json({ success: true, message: 'Password updated successfully' });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = matchedData(req, { locations: ['body'] });
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordTokenHash: tokenHash,
    resetPasswordExpiresAt: { $gt: new Date() },
  }).select('+password');

  if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });

  user.password = newPassword;
  user.resetPasswordTokenHash = undefined;
  user.resetPasswordExpiresAt = undefined;
  await user.save();

  return res.json({ success: true, message: 'Password reset successful' });
});
