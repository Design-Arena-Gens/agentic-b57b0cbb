const { StatusCodes } = require('http-status-codes');
const ChatLog = require('../models/ChatLog');
const { getAssistantResponse } = require('../services/aiService');

const listChatLogs = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const logs = await ChatLog.find({ project: projectId }).sort({ createdAt: 1 }).lean();
    return res.json(logs);
  } catch (err) {
    return next(err);
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { message } = req.body;

    const userLog = await ChatLog.create({
      project: projectId,
      user: req.user._id,
      role: 'user',
      message,
    });

    const assistantReply = await getAssistantResponse(projectId, req.user, message);

    const assistantLog = await ChatLog.create({
      project: projectId,
      role: 'assistant',
      message: assistantReply,
    });

    req.io.to(projectId).emit('chat:message', assistantLog);

    return res.status(StatusCodes.CREATED).json({
      userLog,
      assistantLog,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  listChatLogs,
  sendMessage,
};
