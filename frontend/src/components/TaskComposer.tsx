'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus } from 'lucide-react';

const taskSchema = z.object({
  title: z.string().min(3, 'Task title must be at least 3 characters'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  dueDate: z.string().optional(),
});

type TaskFormInput = z.input<typeof taskSchema>;
type TaskFormOutput = z.output<typeof taskSchema>;

interface TaskComposerProps {
  onCreate: (payload: TaskFormOutput) => Promise<void> | void;
}

const TaskComposer = ({ onCreate }: TaskComposerProps) => {
  const form = useForm<TaskFormInput>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
    },
  });

  const onSubmit = async (values: TaskFormInput) => {
    const parsed = taskSchema.parse(values);
    await onCreate(parsed);
    form.reset({ title: '', description: '', priority: 'medium', dueDate: '' });
  };

  const loading = form.formState.isSubmitting;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="rounded-3xl border border-white/10 bg-slate-900/80 p-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Quick task</h3>
        <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
          Auto-sync to board
        </span>
      </div>
      <div className="mt-5 space-y-4">
        <div>
          <label className="text-xs uppercase tracking-wide text-slate-400" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            {...form.register('title')}
            placeholder="Define integration requirements"
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-emerald-500/40 transition focus:ring-2"
          />
          {form.formState.errors.title && <p className="text-xs text-rose-300">{form.formState.errors.title.message}</p>}
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide text-slate-400" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            {...form.register('description')}
            placeholder="Add quick context for the assignee and automations."
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-emerald-500/40 transition focus:ring-2"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-wide text-slate-400" htmlFor="priority">
              Priority
            </label>
            <select
              id="priority"
              {...form.register('priority')}
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-emerald-500/40 transition focus:ring-2"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-slate-400" htmlFor="dueDate">
              Due date
            </label>
            <input
              id="dueDate"
              type="date"
              {...form.register('dueDate')}
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-emerald-500/40 transition focus:ring-2"
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        Add task
      </button>
    </form>
  );
};

export type TaskComposerValues = TaskFormOutput;

export default TaskComposer;
