const express = require('express');
const { body } = require('express-validator');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.use(authMiddleware);

router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('projectId').notEmpty().withMessage('Project ID is required'),
  ],
  taskController.createTask,
);

router.get('/:projectId', taskController.listTasksByProject);
router.put('/update/:taskId', taskController.updateTask);

module.exports = router;
