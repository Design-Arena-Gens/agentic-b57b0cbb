const express = require('express');
const { body } = require('express-validator');
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.use(authMiddleware);

router.get('/:projectId', chatController.listChatLogs);

router.post(
  '/:projectId',
  [body('message').notEmpty().withMessage('Message is required')],
  chatController.sendMessage,
);

module.exports = router;
