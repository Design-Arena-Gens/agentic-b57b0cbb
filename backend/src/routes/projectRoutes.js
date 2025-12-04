const express = require('express');
const { body } = require('express-validator');
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.post(
  '/',
  [body('name').notEmpty().withMessage('Project name is required')],
  projectController.createProject,
);

router.get('/', projectController.listProjects);
router.get('/:projectId', projectController.getProject);
router.put('/:projectId', projectController.updateProject);

module.exports = router;
