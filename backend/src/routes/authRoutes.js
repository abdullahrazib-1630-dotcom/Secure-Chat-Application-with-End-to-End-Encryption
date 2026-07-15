const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiters');
const { csrfProtection } = require('../middleware/csrf');
const { registerValidation, loginValidation, validate } = require('../middleware/validators');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authLimiter, registerValidation, authController.register);
router.post('/login', authLimiter, loginValidation, authController.login);
router.post('/forgot-password', authLimiter, body('email').isEmail().normalizeEmail(), validate, authController.forgotPassword);
router.post('/reset-password', authLimiter, body('token').isLength({ min: 20 }), body('newPassword').isStrongPassword({ minLength: 8 }), validate, authController.resetPassword);
router.get('/csrf-token', authController.getCsrfToken);
router.post('/logout', auth, csrfProtection, authController.logout);
router.post('/change-password', auth, csrfProtection, body('oldPassword').isLength({ min: 8 }), body('newPassword').isStrongPassword({ minLength: 8 }), validate, authController.changePassword);
router.get('/me', auth, authController.getCurrentUser);

module.exports = router;
