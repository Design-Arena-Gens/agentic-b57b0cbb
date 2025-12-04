const { StatusCodes } = require('http-status-codes');
const { validationResult } = require('express-validator');
const AutomationRule = require('../models/AutomationRule');

const createRule = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    const rule = await AutomationRule.create({
      ...req.body,
      creator: req.user._id,
    });

    return res.status(StatusCodes.CREATED).json(rule);
  } catch (err) {
    return next(err);
  }
};

const listRules = async (req, res, next) => {
  try {
    const rules = await AutomationRule.find({ project: req.params.projectId }).lean();
    return res.json(rules);
  } catch (err) {
    return next(err);
  }
};

const toggleRule = async (req, res, next) => {
  try {
    const rule = await AutomationRule.findById(req.params.ruleId);
    if (!rule) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Rule not found' });
    }

    rule.isActive = !rule.isActive;
    await rule.save();

    return res.json(rule);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createRule,
  listRules,
  toggleRule,
};
