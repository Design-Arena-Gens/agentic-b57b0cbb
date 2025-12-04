'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Bot, ChevronDown, GitBranchPlus, LayoutDashboard, LogOut, Settings, Workflow } from 'lucide-react';
import { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProjects } from '@/context/ProjectContext';

const navItems = [
  { href: '/dashboard/projects', label: 'Projects', icon: LayoutDashboard },
  { href: '/dashboard/tasks', label: 'Tasks', icon: Workflow },
  { href: '/dashboard/automation', label: 'Automation', icon: GitBranchPlus },
  { href: '/dashboard/chat', label: 'AI Assistant', icon: Bot },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { projects, selectedProject, selectProject } = useProjects();

  const initials = useMemo(() => {
    if (!user) return '';
    return user.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [user]);

  return (
    <div className="flex min-h-screen gap-6 bg-slate-950 px-6 py-6 text-slate-100">
      <aside className="hidden w-64 flex-col rounded-3xl border border-white/10 bg-slate-900/60 p-6 lg:flex">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-slate-900">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-widest text-slate-400">TaskFlow</p>
            <h1 className="text-lg font-semibold">Control Tower</h1>
          </div>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/40'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="h-4 w-4 text-emerald-300" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-4">
          <Link
            href="/dashboard/automation"
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-300 transition hover:border-emerald-500/30 hover:text-emerald-300"
          >
            <Settings className="h-4 w-4 text-emerald-400" />
            Automation Studio
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-800/80 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-rose-500/20 hover:text-rose-200"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>
      <div className="flex flex-1 flex-col gap-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-300">Command Center</p>
            <h2 className="text-3xl font-semibold text-white">TaskFlow Pro</h2>
            <p className="text-sm text-slate-400">Monitor automation, progress, and insights in one place.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="group relative flex min-w-[220px] items-center gap-3 rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 transition hover:border-emerald-500/40">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                {initials || '?'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{user?.name}</p>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-500 transition group-hover:text-emerald-300" />
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3">
              <p className="text-xs uppercase tracking-wider text-slate-400">Active project</p>
              <select
                value={selectedProject?._id ?? ''}
                onChange={(event) => selectProject(event.target.value)}
                className="rounded-lg bg-slate-950 px-3 py-2 text-sm text-white"
              >
                {projects.map((project) => (
                  <option key={project._id} value={project._id} className="bg-slate-900 text-slate-200">
                    {project.name}
                  </option>
                ))}
                {!projects.length && <option value="">No projects</option>}
              </select>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
