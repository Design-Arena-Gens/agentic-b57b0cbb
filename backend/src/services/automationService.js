const AutomationRule = require('../models/AutomationRule');
const Task = require('../models/Task');

const evaluateCondition = (task, condition) => {
  const { field, operator, value } = condition;
  const taskValue = task[field];

  switch (operator) {
    case 'equals':
      return taskValue?.toString() === value?.toString();
    case 'not_equals':
      return taskValue?.toString() !== value?.toString();
    case 'contains':
      return Array.isArray(taskValue) && taskValue.includes(value);
    case 'not_contains':
      return Array.isArray(taskValue) && !taskValue.includes(value);
    case 'gte':
      return taskValue >= value;
    case 'lte':
      return taskValue <= value;
    case 'changed':
      return true;
    default:
      return false;
  }
};

const executeAction = async (task, action) => {
  switch (action.type) {
    case 'update_status':
      task.status = action.payload?.status || task.status;
      break;
    case 'assign_user':
      task.assignee = action.payload?.assignee || task.assignee;
      break;
    case 'notify':
      task.activityLog.push({
        message: action.payload?.message || 'Automation notification',
      });
      break;
    case 'add_comment':
      task.activityLog.push({
        message: action.payload?.comment || 'Automation comment',
      });
      break;
    default:
      break;
  }
};

const runAutomationsForTask = async (projectId, event, task) => {
  const rules = await AutomationRule.find({
    project: projectId,
    isActive: true,
    'trigger.event': event,
  });

  if (!rules.length) {
    return;
  }

  let taskChanged = false;

  for (const rule of rules) {
    const conditions = rule.trigger?.conditions || [];
    const isMatch = conditions.every((condition) => evaluateCondition(task, condition));

    if (!isMatch) {
      continue;
    }

    for (const action of rule.actions) {
      await executeAction(task, action);
      taskChanged = true;
    }

    rule.lastRunAt = new Date();
    await rule.save();
  }

  if (taskChanged) {
    await Task.findByIdAndUpdate(task._id, task, { new: true });
  }
};

module.exports = {
  runAutomationsForTask,
};
