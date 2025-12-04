'use client';

import { useState } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2, 'Name is required'),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const { login, register: registerUser, loading } = useAuth();

  const form = useForm<LoginForm | RegisterForm>({
    resolver: zodResolver(mode === 'login' ? loginSchema : registerSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  });

  const onSubmit = async (values: LoginForm | RegisterForm) => {
    if (mode === 'login') {
      await login(values.email, values.password);
    } else {
      const registerValues = values as RegisterForm;
      await registerUser(registerValues.name, registerValues.email, registerValues.password);
    }
  };

  const registerErrors = form.formState.errors as FieldErrors<RegisterForm>;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-slate-900 to-indigo-600/20 blur-3xl" />
      <div className="relative z-10 flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-emerald-900/20 sm:flex-row">
        <div className="flex flex-1 flex-col justify-between p-10">
          <div className="flex items-center gap-2 text-emerald-400">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm uppercase tracking-widest">TaskFlow Pro</span>
          </div>
          <div>
            <h1 className="text-4xl font-semibold text-white sm:text-5xl">Automate your workflow</h1>
            <p className="mt-4 max-w-md text-slate-300">
              Collaborate on projects, track task progress, design automation rules, and tap into the AI assistant for
              strategic insights.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-800/80 p-6 text-sm text-slate-300">
            <p className="font-semibold text-emerald-300">Highlights</p>
            <ul className="mt-2 space-y-1 text-slate-300">
              <li>• Real-time dashboards with smart automations</li>
              <li>• AI assistant trained on your projects and tasks</li>
              <li>• Secure JWT authentication and role management</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-center gap-6 bg-slate-950/70 p-10 backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400">{mode === 'login' ? 'Welcome back' : 'Start now'}</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">
              {mode === 'login' ? 'Sign in to continue' : 'Create your workspace'}
            </h2>
          </div>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            {mode === 'register' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-200" htmlFor="name">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  {...form.register('name')}
                  placeholder="Jordan Lee"
                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none ring-emerald-500/40 transition focus:ring-2"
                />
                {registerErrors.name && <p className="text-sm text-rose-400">{registerErrors.name.message}</p>}
              </div>
            )}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-200" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...form.register('email')}
                placeholder="team@taskflow.pro"
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none ring-emerald-500/40 transition focus:ring-2"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-rose-400">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-200" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                {...form.register('password')}
                placeholder="••••••••"
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none ring-emerald-500/40 transition focus:ring-2"
              />
              {form.formState.errors.password && (
                <p className="text-sm text-rose-400">{form.formState.errors.password.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
          <p className="text-sm text-slate-400">
            {mode === 'login' ? (
              <>
                New to TaskFlow Pro?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    form.reset();
                  }}
                  className="font-semibold text-emerald-400"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    form.reset();
                  }}
                  className="font-semibold text-emerald-400"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
