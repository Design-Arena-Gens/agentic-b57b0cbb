'use client';

import { motion } from 'framer-motion';
import { Power, Workflow } from 'lucide-react';
import type { AutomationRule } from '@/types';

interface AutomationListProps {
  rules: AutomationRule[];
  onToggle: (ruleId: string) => Promise<void> | void;
}

const AutomationList = ({ rules, onToggle }: AutomationListProps) => {
  if (!rules.length) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/60 p-10 text-center text-sm text-slate-400">
        No automation rules yet. Create one to trigger task updates automatically.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rules.map((rule) => (
        <motion.div
          key={rule._id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/10 bg-slate-900/80 p-6"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="text-lg font-semibold text-white">{rule.name}</h4>
              <p className="text-xs uppercase tracking-wide text-slate-500">{rule.trigger.event}</p>
            </div>
            <button
              type="button"
              onClick={() => onToggle(rule._id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
                rule.isActive
                  ? 'bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30'
                  : 'bg-slate-800/80 text-slate-400 hover:text-emerald-200'
              }`}
            >
              <Power className="h-4 w-4" />
              {rule.isActive ? 'Active' : 'Paused'}
            </button>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
              <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
                <Workflow className="h-4 w-4 text-cyan-300" />
                Conditions
              </p>
              <ul className="mt-2 space-y-1">
                {rule.trigger.conditions.map((condition, index) => (
                  <li key={index} className="text-slate-200">
                    <span className="text-emerald-300">{condition.field}</span> {condition.operator}{' '}
                    <span className="text-cyan-200">{String(condition.value)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
              <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
                <Workflow className="h-4 w-4 text-emerald-300" />
                Actions
              </p>
              <ul className="mt-2 space-y-1">
                {rule.actions.map((action, index) => (
                  <li key={index}>
                    <span className="text-emerald-300">{action.type}</span> →{' '}
                    <span className="text-cyan-200">{JSON.stringify(action.payload)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AutomationList;
