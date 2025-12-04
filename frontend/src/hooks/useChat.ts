'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import type { ChatLog } from '@/types';
import { useSocket } from '@/context/SocketContext';

export const useChat = (projectId: string | null) => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState<ChatLog[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = useCallback(async () => {
    if (!projectId) {
      setMessages([]);
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.get<ChatLog[]>(`/chat/${projectId}`);
      setMessages(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load chat history');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (!socket || !projectId) {
      return;
    }

    const handleIncoming = (log: ChatLog) => {
      setMessages((prev) => [...prev, log]);
    };

    socket.on('chat:message', handleIncoming);

    return () => {
      socket.off('chat:message', handleIncoming);
    };
  }, [socket, projectId]);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!projectId) {
        toast.error('Select a project first');
        return;
      }

      try {
        const { data } = await api.post<{ userLog: ChatLog; assistantLog: ChatLog }>(`/chat/${projectId}`, { message });
        setMessages((prev) => [...prev, data.userLog, data.assistantLog]);
      } catch (error) {
        console.error(error);
        toast.error('Failed to send message');
      }
    },
    [projectId],
  );

  return { messages, loading, sendMessage, refresh: fetchMessages };
};
