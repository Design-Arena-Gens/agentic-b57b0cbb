'use client';

import { useProjects } from '@/context/ProjectContext';
import { useChat } from '@/hooks/useChat';
import AIChatPanel from '@/components/AIChatPanel';

export default function ChatPage() {
  const { selectedProject } = useProjects();
  const { messages, loading, sendMessage } = useChat(selectedProject?._id ?? null);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <AIChatPanel
        messages={messages}
        loading={loading}
        onSend={async (message) => {
          await sendMessage(message);
        }}
        projectName={selectedProject?.name}
      />
      <aside className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/80 p-6 text-sm text-slate-300">
        <h3 className="text-lg font-semibold text-white">Conversation starters</h3>
        <button
          type="button"
          onClick={() =>
            sendMessage(
              'Give me a status update highlighting blockers, overdue tasks, and upcoming deadlines for the current project.',
            )
          }
          className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-left transition hover:border-emerald-400/40 hover:text-emerald-200"
        >
          Request a risk assessment
        </button>
        <button
          type="button"
          onClick={() =>
            sendMessage(
              'Suggest a new automation rule to reduce manual updates based on the current task distribution.',
            )
          }
          className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-left transition hover:border-emerald-400/40 hover:text-emerald-200"
        >
          Design an automation
        </button>
        <button
          type="button"
          onClick={() =>
            sendMessage(
              'Summarize the project timeline and recommend next best actions for the team this week.',
            )
          }
          className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-left transition hover:border-emerald-400/40 hover:text-emerald-200"
        >
          Weekly action plan
        </button>
      </aside>
    </div>
  );
}
