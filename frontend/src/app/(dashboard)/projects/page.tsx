'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Clock, PlusCircle, Users } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useProjects } from '@/context/ProjectContext';
import { useTasks } from '@/hooks/useTasks';

const projectSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters'),
  description: z.string().optional(),
  dueDate: z.string().optional(),
});

type ProjectForm = z.infer<typeof projectSchema>;

export default function ProjectsPage() {
  const { projects, selectedProject, createProject, selectProject } = useProjects();
  const { tasks } = useTasks(selectedProject?._id ?? null);

  const form = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      dueDate: '',
    },
  });

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((task) => task.status === 'done').length;
    const inProgress = tasks.filter((task) => task.status === 'in_progress').length;
    const blocked = tasks.filter((task) => task.status === 'blocked').length;
    return [
      { label: 'Total tasks', value: total, accent: 'text-slate-200' },
      { label: 'In progress', value: inProgress, accent: 'text-amber-300' },
      { label: 'Completed', value: done, accent: 'text-emerald-300' },
      { label: 'Blocked', value: blocked, accent: 'text-rose-300' },
    ];
  }, [tasks]);

  const onSubmit = async (values: ProjectForm) => {
    await createProject(values);
    form.reset();
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/80 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">Project portfolio</h3>
              <p className="text-sm text-slate-400">Monitor milestones and team alignment.</p>
            </div>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-xs font-semibold text-emerald-300">
              {projects.length} active
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 shadow-inner shadow-black/30"
              >
                <p className="text-xs uppercase tracking-wide text-slate-500">{stat.label}</p>
                <p className={`mt-2 text-3xl font-semibold ${stat.accent}`}>{stat.value}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((project) => (
              <button
                key={project._id}
                onClick={() => selectProject(project._id)}
                type="button"
                className={`rounded-2xl border px-5 py-4 text-left transition ${
                  selectedProject?._id === project._id
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                    : 'border-white/10 bg-slate-950/60 text-slate-200 hover:border-emerald-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold">{project.name}</h4>
                  <span className="rounded-full bg-slate-800/70 px-3 py-1 text-xs uppercase tracking-wide text-slate-300">
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-slate-400">{project.description}</p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {project.members.length} members
                  </span>
                  {project.dueDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Due {format(parseISO(project.dueDate), 'MMM d')}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Updated {format(parseISO(project.updatedAt), 'MMM d, HH:mm')}
                  </span>
                </div>
              </button>
            ))}
            {!projects.length && (
              <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/60 p-6 text-center text-slate-400">
                No projects yet. Create your first workspace on the right.
              </div>
            )}
          </div>
        </div>
        <div className="h-full rounded-3xl border border-emerald-500/30 bg-slate-900/80 p-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-emerald-200">
            <PlusCircle className="h-5 w-5" />
            Launch a new project
          </h3>
          <p className="mt-1 text-sm text-emerald-200/70">
            Define scope, timelines, and collaborators. Automations, tasks, and chat will adapt instantly.
          </p>
          <form className="mt-6 space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-slate-400" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                {...form.register('name')}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-emerald-500/40 transition focus:ring-2"
                placeholder="Automation Excellence Initiative"
              />
              {form.formState.errors.name && (
                <p className="text-xs text-rose-300">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-slate-400" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                {...form.register('description')}
                rows={4}
                placeholder="Short description for teammates and the AI assistant."
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-emerald-500/40 transition focus:ring-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-slate-400" htmlFor="dueDate">
                Target completion
              </label>
              <input
                id="dueDate"
                type="date"
                {...form.register('dueDate')}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-emerald-500/40 transition focus:ring-2"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
            >
              Create project
            </button>
          </form>
        </div>
      </section>
      {selectedProject && (
        <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
          <h3 className="text-lg font-semibold text-white">Recent activity</h3>
          <div className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-2 text-sm text-slate-300">
            {tasks.slice(0, 8).map((task) => (
              <div key={task._id} className="rounded-2xl border border-white/5 bg-slate-950/60 px-4 py-3">
                <p className="font-semibold text-emerald-200">{task.title}</p>
                <p className="text-xs uppercase tracking-wide text-slate-500">{task.status}</p>
                <ul className="mt-2 space-y-1 text-xs text-slate-400">
                  {task.activityLog.slice(-2).map((log, index) => (
                    <li key={index}>{log.message}</li>
                  ))}
                </ul>
              </div>
            ))}
            {!tasks.length && <p className="text-slate-500">No task activity yet.</p>}
          </div>
        </section>
      )}
    </div>
  );
}
