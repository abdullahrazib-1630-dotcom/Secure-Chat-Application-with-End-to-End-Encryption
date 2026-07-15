const express = require('express');
const auth = require('../middleware/auth');
const { csrfProtection } = require('../middleware/csrf');
const { messageValidation, objectIdParamValidation } = require('../middleware/validators');
const messageController = require('../controllers/messageController');

const router = express.Router();

router.post('/', auth, csrfProtection, messageValidation, messageController.sendMessage);
router.get('/chat/:id', auth, objectIdParamValidation, messageController.getMessagesForChat);
router.patch('/:id/read', auth, csrfProtection, objectIdParamValidation, messageController.markAsRead);

module.exports = router;
