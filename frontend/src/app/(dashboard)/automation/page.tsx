'use client';

import { useProjects } from '@/context/ProjectContext';
import { useAutomations } from '@/hooks/useAutomations';
import AutomationBuilder from '@/components/AutomationBuilder';
import AutomationList from '@/components/AutomationList';

export default function AutomationPage() {
  const { selectedProject } = useProjects();
  const { rules, loading, createRule, toggleRule } = useAutomations(selectedProject?._id ?? null);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">Automation studio</h3>
              <p className="text-sm text-slate-400">
                Design powerful IF/THEN rules that orchestrate your workflows in real time.
              </p>
            </div>
            <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1 text-xs font-semibold text-emerald-200">
              {rules.length} rules
            </span>
          </div>
          <div className="mt-6">
            {loading ? (
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-10 text-center text-sm text-slate-400">
                Loading rules...
              </div>
            ) : (
              <AutomationList rules={rules} onToggle={toggleRule} />
            )}
          </div>
        </div>
        <AutomationBuilder
          projectId={selectedProject?._id ?? null}
          onCreate={async (payload) => {
            await createRule(payload);
          }}
        />
      </div>
    </div>
  );
}
