'use client';

import { useState } from 'react';
import { Sparkles, Trash2 } from 'lucide-react';
import type { AutomationAction, AutomationCondition } from '@/types';

interface AutomationBuilderProps {
  onCreate: (payload: {
    name: string;
    project: string;
    trigger: { event: string; conditions: AutomationCondition[] };
    actions: AutomationAction[];
  }) => Promise<void> | void;
  projectId: string | null;
}

const fieldOptions = [
  { value: 'status', label: 'Task status' },
  { value: 'priority', label: 'Task priority' },
  { value: 'assignee', label: 'Assignee' },
];

const eventOptions = [
  { value: 'task_created', label: 'When a task is created' },
  { value: 'task_updated', label: 'When a task is updated' },
];

const operatorOptions = [
  { value: 'equals', label: 'equals' },
  { value: 'not_equals', label: 'does not equal' },
  { value: 'changed', label: 'changes' },
];

const actionOptions = [
  { value: 'update_status', label: 'Update status' },
  { value: 'assign_user', label: 'Assign user' },
  { value: 'notify', label: 'Send notification' },
  { value: 'add_comment', label: 'Add comment to activity log' },
];

const AutomationBuilder = ({ onCreate, projectId }: AutomationBuilderProps) => {
  const [name, setName] = useState('');
  const [event, setEvent] = useState(eventOptions[0].value);
  const [conditions, setConditions] = useState<AutomationCondition[]>([
    { field: 'status', operator: 'equals', value: 'todo' },
  ]);
  const [actions, setActions] = useState<AutomationAction[]>([
    { type: 'update_status', payload: { status: 'in_progress' } },
  ]);

  const updateCondition = (index: number, key: keyof AutomationCondition, value: string) => {
    setConditions((prev) => prev.map((condition, idx) => (idx === index ? { ...condition, [key]: value } : condition)));
  };

  const updateAction = (index: number, key: keyof AutomationAction, value: string) => {
    setActions((prev) =>
      prev.map((action, idx) =>
        idx === index
          ? {
              ...action,
              [key]: value,
              payload: key === 'type' ? {} : action.payload,
            }
          : action,
      ),
    );
  };

  const updateActionPayload = (index: number, value: string) => {
    setActions((prev) =>
      prev.map((action, idx) => {
        if (idx !== index) {
          return action;
        }
        const payloadKey = action.type === 'update_status' ? 'status' : action.type === 'assign_user' ? 'assignee' : 'message';
        return { ...action, payload: { [payloadKey]: value } };
      }),
    );
  };

  const resetForm = () => {
    setName('');
    setEvent(eventOptions[0].value);
    setConditions([{ field: 'status', operator: 'equals', value: 'todo' }]);
    setActions([{ type: 'update_status', payload: { status: 'in_progress' } }]);
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-emerald-200">
        <Sparkles className="h-5 w-5" />
        Automation builder
      </div>
      <p className="mt-1 text-sm text-slate-400">Translate business logic into automation rules.</p>
      <div className="mt-5 space-y-5">
        <div>
          <label className="text-xs uppercase tracking-wide text-slate-400">Rule name</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Escalate critical tasks"
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-emerald-500/40 transition focus:ring-2"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide text-slate-400">Trigger</label>
          <select
            value={event}
            onChange={(event) => setEvent(event.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-emerald-500/40 transition focus:ring-2"
          >
            {eventOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wide text-slate-400">Conditions</p>
            <button
              type="button"
              onClick={() => setConditions((prev) => [...prev, { field: 'status', operator: 'equals', value: 'todo' }])}
              className="text-xs font-semibold text-emerald-300"
            >
              + Add condition
            </button>
          </div>
          <div className="space-y-3">
            {conditions.map((condition, index) => (
              <div key={index} className="grid gap-3 sm:grid-cols-[140px_140px_1fr_auto]">
                <select
                  value={condition.field}
                  onChange={(event) => updateCondition(index, 'field', event.target.value)}
                  className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white"
                >
                  {fieldOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <select
                  value={condition.operator}
                  onChange={(event) => updateCondition(index, 'operator', event.target.value)}
                  className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white"
                >
                  {operatorOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <input
                  value={condition.value}
                  onChange={(event) => updateCondition(index, 'value', event.target.value)}
                  placeholder="Value"
                  className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={() => setConditions((prev) => prev.filter((_, idx) => idx !== index))}
                  className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:text-rose-300 disabled:opacity-40"
                  disabled={conditions.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wide text-slate-400">Actions</p>
            <button
              type="button"
              onClick={() => setActions((prev) => [...prev, { type: 'notify', payload: { message: 'Reminder sent' } }])}
              className="text-xs font-semibold text-emerald-300"
            >
              + Add action
            </button>
          </div>
          <div className="space-y-3">
            {actions.map((action, index) => {
              const payloadValue =
                action.type === 'update_status'
                  ? (action.payload?.status as string) ?? ''
                  : action.type === 'assign_user'
                    ? (action.payload?.assignee as string) ?? ''
                    : (action.payload?.message as string) ?? '';
              return (
                <div key={index} className="grid gap-3 sm:grid-cols-[180px_1fr_auto]">
                  <select
                    value={action.type}
                    onChange={(event) => updateAction(index, 'type', event.target.value)}
                    className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white"
                  >
                    {actionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <input
                    value={payloadValue}
                    onChange={(event) => updateActionPayload(index, event.target.value)}
                    placeholder={
                      action.type === 'update_status'
                        ? 'e.g. done'
                        : action.type === 'assign_user'
                          ? 'assignee user id'
                          : 'notification message'
                    }
                    className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setActions((prev) => prev.filter((_, idx) => idx !== index))}
                    className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:text-rose-300 disabled:opacity-40"
                    disabled={actions.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <button
          type="button"
          onClick={async () => {
            if (!projectId) {
              return;
            }
            await onCreate({
              name,
              project: projectId,
              trigger: { event, conditions },
              actions,
            });
            resetForm();
          }}
          className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={!projectId || !name.trim()}
        >
          Save automation
        </button>
      </div>
    </div>
  );
};

export default AutomationBuilder;
