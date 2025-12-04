'use client';

import { useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar, CheckCircle2, CircleDot, Loader2, MessageSquare, MoreHorizontal } from 'lucide-react';
import type { Task } from '@/types';

const statusConfig = [
  { key: 'todo', label: 'To do', accent: 'border-slate-700', dot: 'bg-slate-500' },
  { key: 'in_progress', label: 'In progress', accent: 'border-amber-500/40', dot: 'bg-amber-400' },
  { key: 'blocked', label: 'Blocked', accent: 'border-rose-500/40', dot: 'bg-rose-400' },
  { key: 'done', label: 'Completed', accent: 'border-emerald-500/40', dot: 'bg-emerald-400' },
] as const;

interface TaskBoardProps {
  tasks: Task[];
  loading: boolean;
  onStatusChange: (taskId: string, status: Task['status']) => void;
}

const TaskBoard = ({ tasks, loading, onStatusChange }: TaskBoardProps) => {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  const grouped = useMemo(() => {
    return statusConfig.map((status) => ({
      ...status,
      tasks: tasks.filter((task) => task.status === status.key),
    }));
  }, [tasks]);

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-white/10 bg-slate-900/80">
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-slate-950/70 px-6 py-3 text-slate-300">
          <Loader2 className="h-4 w-4 animate-spin text-emerald-300" />
          <span>Fetching tasks...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {grouped.map((column) => (
        <div key={column.key} className="flex flex-col rounded-3xl border border-white/10 bg-slate-900/80 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${column.dot}`} />
              <p className="text-sm font-semibold text-white">{column.label}</p>
            </div>
            <span className="rounded-full bg-slate-800/80 px-3 py-1 text-xs text-slate-400">
              {column.tasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {column.tasks.map((task) => (
              <div
                key={task._id}
                className={`group rounded-2xl border ${column.accent} bg-slate-950/60 p-4 transition hover:-translate-y-0.5 hover:border-emerald-400/40`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{task.title}</p>
                    <p className="mt-1 text-xs text-slate-400 line-clamp-3">{task.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setExpandedTask((prev) => (prev === task._id ? null : task._id))}
                    className="rounded-full bg-slate-900/90 p-1 text-slate-500 transition hover:text-emerald-300"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  {task.dueDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(parseISO(task.dueDate), 'MMM d')}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {task.activityLog.length} logs
                  </span>
                  {task.assignee && (
                    <span className="rounded-full bg-slate-800/80 px-3 py-1 text-slate-300">
                      {task.assignee.name}
                    </span>
                  )}
                </div>
                {expandedTask === task._id && (
                  <div className="mt-3 space-y-2 rounded-xl border border-white/10 bg-slate-900/80 p-3 text-xs text-slate-300">
                    <p className="font-semibold text-emerald-200">Activity</p>
                    <ul className="space-y-1">
                      {task.activityLog.slice(-4).map((log, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CircleDot className="mt-0.5 h-3 w-3 text-emerald-400" />
                          <span>{log.message}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2">
                      {statusConfig.map((status) => (
                        <button
                          key={status.key}
                          type="button"
                          onClick={() => {
                            if (status.key !== task.status) {
                              onStatusChange(task._id, status.key);
                            }
                          }}
                          className={`flex items-center gap-1 rounded-full px-3 py-1 transition ${
                            task.status === status.key
                              ? 'bg-emerald-500/20 text-emerald-200'
                              : 'bg-slate-800/80 text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-200'
                          }`}
                        >
                          {status.key === 'done' ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : (
                            <CircleDot className="h-3.5 w-3.5" />
                          )}
                          {status.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {!column.tasks.length && (
              <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-6 text-center text-xs text-slate-500">
                Nothing here yet.
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskBoard;
