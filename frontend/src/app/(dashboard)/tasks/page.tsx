'use client';

import { useMemo } from 'react';
import { AlertTriangle, BarChart4, Target } from 'lucide-react';
import { useProjects } from '@/context/ProjectContext';
import { useTasks } from '@/hooks/useTasks';
import TaskComposer, { TaskComposerValues } from '@/components/TaskComposer';
import TaskBoard from '@/components/TaskBoard';

export default function TasksPage() {
  const { selectedProject } = useProjects();
  const { tasks, loading, createTask, updateTask } = useTasks(selectedProject?._id ?? null);

  const metrics = useMemo(() => {
    const total = tasks.length || 1;
    const done = tasks.filter((task) => task.status === 'done').length;
    const inProgress = tasks.filter((task) => task.status === 'in_progress').length;
    const completion = Math.round((done / total) * 100);
    return {
      completion,
      inProgress,
      overdue: tasks.filter((task) => {
        if (!task.dueDate || task.status === 'done') {
          return false;
        }
        return new Date(task.dueDate) < new Date();
      }).length,
    };
  }, [tasks]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">
                {selectedProject ? selectedProject.name : 'No project selected'}
              </h3>
              <p className="text-sm text-slate-400">
                {selectedProject ? selectedProject.description : 'Select a project to begin managing tasks.'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-200">
                {metrics.completion}% completion
              </div>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
                <BarChart4 className="h-4 w-4 text-emerald-300" />
                In progress
              </div>
              <p className="mt-3 text-3xl font-semibold text-white">{metrics.inProgress}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
                <Target className="h-4 w-4 text-cyan-300" />
                Completion
              </div>
              <p className="mt-3 text-3xl font-semibold text-white">{metrics.completion}%</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
                <AlertTriangle className="h-4 w-4 text-rose-300" />
                At risk
              </div>
              <p className="mt-3 text-3xl font-semibold text-white">{metrics.overdue}</p>
            </div>
          </div>
          <div className="mt-6">
            <TaskBoard
              tasks={tasks}
              loading={loading}
              onStatusChange={(taskId, status) => updateTask(taskId, { status })}
            />
          </div>
        </div>
        <TaskComposer onCreate={(payload: TaskComposerValues) => createTask(payload)} />
      </div>
    </div>
  );
}
