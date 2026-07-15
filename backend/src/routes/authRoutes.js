const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  getMe,
} = require('../controllers/authController');
const validateRequest = require('../middleware/validateRequest');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiters');

const router = express.Router();

const passwordValidation = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[a-z]/)
  .withMessage('Password must contain at least one lowercase letter')
  .matches(/[0-9]/)
  .withMessage('Password must contain at least one number');

router.post(
  '/register',
  authLimiter,
  [
    body('name').trim().isLength({ min: 2, max: 50 }),
    body('email').isEmail().normalizeEmail(),
    passwordValidation,
  ],
  validateRequest,
  register
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
    body('rememberMe').optional().isBoolean(),
  ],
  validateRequest,
  login
);

router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

router.post(
  '/forgot-password',
  authLimiter,
  [body('email').isEmail().normalizeEmail()],
  validateRequest,
  forgotPassword
);

router.post(
  '/reset-password',
  authLimiter,
  [
    body('token').trim().notEmpty().withMessage('Reset token is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters')
      .matches(/[A-Z]/)
      .withMessage('New password must contain at least one uppercase letter')
      .matches(/[a-z]/)
      .withMessage('New password must contain at least one lowercase letter')
      .matches(/[0-9]/)
      .withMessage('New password must contain at least one number'),
  ],
  validateRequest,
  resetPassword
);

router.post(
  '/change-password',
  protect,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters')
      .matches(/[A-Z]/)
      .withMessage('New password must contain at least one uppercase letter')
      .matches(/[a-z]/)
      .withMessage('New password must contain at least one lowercase letter')
      .matches(/[0-9]/)
      .withMessage('New password must contain at least one number'),
  ],
  validateRequest,
  changePassword
);

module.exports = router;
