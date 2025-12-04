const express = require('express');
const { body } = require('express-validator');
const automationController = require('../controllers/automationController');
const authMiddleware = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.use(authMiddleware);

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Rule name is required'),
    body('project').notEmpty().withMessage('Project is required'),
    body('trigger').notEmpty().withMessage('Trigger definition is required'),
    body('actions').isArray({ min: 1 }).withMessage('At least one action is required'),
  ],
  automationController.createRule,
);

router.get('/:projectId', automationController.listRules);
router.patch('/toggle/:ruleId', automationController.toggleRule);

module.exports = router;
