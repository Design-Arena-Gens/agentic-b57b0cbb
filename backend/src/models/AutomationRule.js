const mongoose = require('mongoose');

const AutomationRuleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    trigger: {
      type: {
        event: {
          type: String,
          required: true,
        },
        conditions: [
          {
            field: String,
            operator: {
              type: String,
              enum: ['equals', 'not_equals', 'contains', 'not_contains', 'gte', 'lte', 'changed'],
              default: 'equals',
            },
            value: mongoose.Schema.Types.Mixed,
          },
        ],
      },
      required: true,
    },
    actions: [
      {
        type: {
          type: String,
          enum: ['update_status', 'assign_user', 'notify', 'add_comment'],
          required: true,
        },
        payload: mongoose.Schema.Types.Mixed,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastRunAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const AutomationRule = mongoose.model('AutomationRule', AutomationRuleSchema);

module.exports = AutomationRule;
