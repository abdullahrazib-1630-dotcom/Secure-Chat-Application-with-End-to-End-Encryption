const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const { csrfProtection } = require('../middleware/csrf');
const { searchValidation, validate } = require('../middleware/validators');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/profile', auth, userController.getProfile);
router.put(
  '/profile',
  auth,
  csrfProtection,
  body('name').optional().trim().isLength({ min: 2, max: 80 }).escape(),
  body('profilePicture').optional().isURL().withMessage('profilePicture must be a URL'),
  body('status').optional().isIn(['online', 'offline', 'away']),
  validate,
  userController.updateProfile
);
router.get('/search', auth, searchValidation, userController.searchUsers);
router.get('/dashboard', auth, userController.getDashboard);

module.exports = router;
