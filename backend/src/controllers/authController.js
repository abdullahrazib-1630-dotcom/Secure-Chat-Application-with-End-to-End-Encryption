const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Session = require('../models/Session');
const { signToken } = require('../utils/token');
const { generateRandomToken, hashValue } = require('../utils/crypto');

const buildCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000,
});

const createSession = async ({ userId, token, req }) => {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await Session.create({
    user: userId,
    tokenHash: hashValue(token),
    ipAddress: req.ip || '',
    userAgent: req.get('user-agent') || '',
    expiresAt,
  });
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409);
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = signToken({ id: user._id.toString() });
    await createSession({ userId: user._id, token, req });

    res.cookie('token', token, buildCookieOptions());

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    user.status = 'online';
    user.lastSeen = new Date();
    await user.save();

    const token = signToken({ id: user._id.toString() });
    await createSession({ userId: user._id, token, req });

    const cookieOptions = buildCookieOptions();

    if (rememberMe) {
      cookieOptions.maxAge = 7 * 24 * 60 * 60 * 1000;
    }

    res.cookie('token', token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const token = req.token || req.cookies?.token;

    if (token) {
      await Session.updateMany({ tokenHash: hashValue(token) }, { isRevoked: true });
    }

    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        status: 'offline',
        lastSeen: new Date(),
      });
    }

    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    return next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select('+passwordResetToken +passwordResetExpires');

    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If this email exists, a reset token has been generated.',
      });
    }

    const resetToken = generateRandomToken(24);
    user.passwordResetToken = hashValue(resetToken);
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset token generated (local implementation).',
      resetToken,
      note: 'Use this token in /api/auth/reset-password for demo purposes.',
    });
  } catch (error) {
    return next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const tokenHash = hashValue(token);

    const user = await User.findOne({
      passwordResetToken: tokenHash,
      passwordResetExpires: { $gt: new Date() },
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) {
      res.status(400);
      throw new Error('Invalid or expired reset token');
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password has been reset successfully',
    });
  } catch (error) {
    return next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      res.status(400);
      throw new Error('Current password is incorrect');
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    return next(error);
  }
};

const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  getMe,
};
