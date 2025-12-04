'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-slate-900/60 px-6 py-3">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
          <span>Preparing your workspace...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
