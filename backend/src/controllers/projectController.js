const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');
const Project = require('../models/Project');
const Task = require('../models/Task');

const createProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    const { name, description, dueDate, members } = req.body;

    const project = await Project.create({
      name,
      description,
      dueDate,
      owner: req.user._id,
      members: members || [req.user._id],
    });

    return res.status(StatusCodes.CREATED).json(project);
  } catch (err) {
    return next(err);
  }
};

const listProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    })
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .lean();
    return res.json(projects);
  } catch (err) {
    return next(err);
  }
};

const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .lean();

    if (!project) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Project not found' });
    }

    const tasks = await Task.find({ project: project._id }).populate('assignee', 'name email');

    return res.json({ ...project, tasks });
  } catch (err) {
    return next(err);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Project not found' });
    }

    if (!project.owner.equals(req.user._id)) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Not authorized' });
    }

    const fields = ['name', 'description', 'status', 'dueDate', 'members'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    await project.save();
    return res.json(project);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createProject,
  listProjects,
  getProject,
  updateProject,
};
