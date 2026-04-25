const express = require('express');
const router = express.Router();
const { chat, getChatOptions } = require('../controllers/chatbotController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Chatbot is available to patients only
router.use(authMiddleware, roleMiddleware('patient'));

router.get('/options', getChatOptions);
router.post('/chat', chat);

module.exports = router;
