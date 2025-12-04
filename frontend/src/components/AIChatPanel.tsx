'use client';

import { useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Bot, Loader2, Send, User } from 'lucide-react';
import type { ChatLog } from '@/types';

interface AIChatPanelProps {
  messages: ChatLog[];
  loading: boolean;
  onSend: (message: string) => Promise<void> | void;
  projectName?: string;
}

const AIChatPanel = ({ messages, loading, onSend, projectName }: AIChatPanelProps) => {
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const lastUpdated = useMemo(() => {
    const lastMessage = messages[messages.length - 1];
    return lastMessage ? format(parseISO(lastMessage.createdAt), 'MMM d, HH:mm') : 'Never';
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) {
      return;
    }
    setSending(true);
    await onSend(input);
    setInput('');
    setSending(false);
  };

  return (
    <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-slate-900/80">
      <div className="border-b border-white/10 px-6 py-4">
        <p className="text-xs uppercase tracking-widest text-emerald-300">AI Orchestrator</p>
        <h3 className="text-xl font-semibold text-white">TaskFlow Assistant</h3>
        <p className="text-xs text-slate-400">Context: {projectName ?? 'Select a project'}</p>
        <p className="text-xs text-slate-500">Last synced: {lastUpdated}</p>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto px-6 py-4">
        {loading && (
          <div className="flex justify-center">
            <span className="rounded-full border border-white/10 bg-slate-950/60 px-4 py-2 text-xs text-slate-400">
              Loading conversation...
            </span>
          </div>
        )}
        {messages.map((log) => (
          <div
            key={log._id}
            className={`flex gap-3 ${log.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
          >
            {log.role === 'assistant' && (
              <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-200">
                <Bot className="h-4 w-4" />
              </span>
            )}
            <div
              className={`max-w-xl rounded-2xl border px-4 py-3 text-sm leading-relaxed ${
                log.role === 'assistant'
                  ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-100'
                  : 'border-sky-500/20 bg-sky-500/10 text-sky-100'
              }`}
            >
              <p>{log.message}</p>
              <p className="mt-2 text-xs uppercase tracking-wide opacity-60">
                {format(parseISO(log.createdAt), 'MMM d, HH:mm')}
              </p>
            </div>
            {log.role === 'user' && (
              <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/20 text-sky-200">
                <User className="h-4 w-4" />
              </span>
            )}
          </div>
        ))}
        {!messages.length && !loading && (
          <div className="flex h-full flex-col items-center justify-center text-center text-sm text-slate-400">
            <Bot className="h-6 w-6 text-emerald-300" />
            <p className="mt-2 font-semibold text-slate-200">Plan with the AI assistant</p>
            <p className="mt-1 text-xs max-w-xs">
              Ask for status reports, automation suggestions, or dependencies. The assistant uses live project data.
            </p>
          </div>
        )}
      </div>
      <div className="border-t border-white/10 bg-slate-950/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyUp={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask for a project summary or automation advice..."
            className="flex-1 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none ring-emerald-500/40 transition focus:ring-2"
          />
          <button
            type="button"
            disabled={sending}
            onClick={handleSend}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-emerald-950 transition hover:bg-emerald-400 disabled:opacity-50"
          >
            {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatPanel;
