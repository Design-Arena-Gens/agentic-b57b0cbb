const { StatusCodes } = require('http-status-codes');
const { validationResult } = require('express-validator');
const Task = require('../models/Task');
const Project = require('../models/Project');
const { runAutomationsForTask } = require('../services/automationService');

const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    const { title, description, projectId, assignee, dueDate, priority } = req.body;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Project not found' });
    }

    const task = await Task.create({
      title,
      description,
      project: projectId,
      assignee,
      dueDate,
      priority,
      activityLog: [{ message: `Task created by ${req.user.name}` }],
    });

    await runAutomationsForTask(projectId, 'task_created', task);

    req.io.to(projectId.toString()).emit('task:created', task);

    return res.status(StatusCodes.CREATED).json(task);
  } catch (err) {
    return next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Task not found' });
    }

    const updatableFields = ['title', 'description', 'status', 'assignee', 'priority', 'dueDate'];
    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    if (req.body.status === 'done') {
      task.completedAt = new Date();
    }

    if (req.body.activityMessage) {
      task.activityLog.push({ message: req.body.activityMessage });
    }

    await task.save();

    await runAutomationsForTask(task.project, 'task_updated', task);

    req.io.to(task.project.toString()).emit('task:updated', task);

    return res.json(task);
  } catch (err) {
    return next(err);
  }
};

const listTasksByProject = async (req, res, next) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId }).populate('assignee', 'name email');
    return res.json(tasks);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createTask,
  updateTask,
  listTasksByProject,
};
