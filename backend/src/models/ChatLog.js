const mongoose = require('mongoose');

const ChatLogSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      default: 'user',
    },
    message: {
      type: String,
      required: true,
    },
    metadata: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  },
);

const ChatLog = mongoose.model('ChatLog', ChatLogSchema);

module.exports = ChatLog;
