const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const { csrfProtection } = require('../middleware/csrf');
const { validate } = require('../middleware/validators');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.get('/', auth, chatController.getUserChats);
router.post('/private', auth, csrfProtection, body('userId').isMongoId(), validate, chatController.getOrCreateChat);

module.exports = router;
