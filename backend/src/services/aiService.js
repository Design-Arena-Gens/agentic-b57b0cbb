const ChatLog = require('../models/ChatLog');
const Project = require('../models/Project');
const Task = require('../models/Task');
const { getOpenAIClient } = require('../config/openai');

const buildContext = async (projectId) => {
  const project = await Project.findById(projectId).lean();
  if (!project) {
    return 'Project context unavailable.';
  }

  const tasks = await Task.find({ project: projectId }).limit(10).lean();
  const summaries = tasks
    .map(
      (task) =>
        `Task "${task.title}" status: ${task.status}, priority: ${task.priority}, due: ${task.dueDate?.toISOString() || 'none'}`,
    )
    .join('\n');

  return `Project: ${project.name}\nStatus: ${project.status}\nSummary of tasks:\n${summaries}`;
};

const getAssistantResponse = async (projectId, user, message) => {
  const systemPrompt =
    'You are TaskFlow Pro, an AI assistant that helps with workflow automation, project status summaries, and task recommendations.';

  const context = await buildContext(projectId);
  const previousMessages = await ChatLog.find({ project: projectId }).sort({ createdAt: -1 }).limit(10).lean();

  const formattedHistory = previousMessages
    .reverse()
    .map((log) => ({ role: log.role, content: log.message }))
    .concat([
      { role: 'system', content: `Context:\n${context}` },
      { role: 'user', content: message },
    ]);

  const openai = getOpenAIClient();

  const response = await openai.responses.create({
    model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
    reasoning: { effort: 'medium' },
    input: [
      { role: 'system', content: systemPrompt },
      ...formattedHistory,
    ],
  });

  const assistantMessage = response.output_text?.trim() || 'I was unable to process that request.';

  return assistantMessage;
};

module.exports = {
  getAssistantResponse,
};
