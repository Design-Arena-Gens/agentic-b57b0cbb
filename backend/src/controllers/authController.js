const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
const { createAccessToken } = require('../utils/token');

const handleValidation = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = StatusCodes.BAD_REQUEST;
    error.details = errors.array();
    throw error;
  }
};

const register = async (req, res, next) => {
  try {
    handleValidation(req);
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(StatusCodes.CONFLICT).json({ message: 'Email already in use' });
    }

    const user = await User.create({ name, email, password });
    const token = createAccessToken(user);

    return res.status(StatusCodes.CREATED).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarColor: user.avatarColor,
      },
    });
  } catch (err) {
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    handleValidation(req);
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' });
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = createAccessToken(user);

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarColor: user.avatarColor,
      },
    });
  } catch (err) {
    return next(err);
  }
};

const getProfile = async (req, res) => {
  const { user } = req;
  return res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarColor: user.avatarColor,
    },
  });
};

module.exports = {
  register,
  login,
  getProfile,
};
