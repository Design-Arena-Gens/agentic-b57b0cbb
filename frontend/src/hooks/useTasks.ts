'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import type { Task } from '@/types';
import { useSocket } from '@/context/SocketContext';

export const useTasks = (projectId: string | null) => {
  const { socket } = useSocket();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    if (!projectId) {
      setTasks([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get<Task[]>(`/tasks/${projectId}`);
      setTasks(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    if (!socket || !projectId) {
      return;
    }

    socket.emit('project:join', projectId);

    const handleCreated = (task: Task) => {
      setTasks((prev) => [task, ...prev]);
    };

    const handleUpdated = (task: Task) => {
      setTasks((prev) => prev.map((item) => (item._id === task._id ? task : item)));
    };

    socket.on('task:created', handleCreated);
    socket.on('task:updated', handleUpdated);

    return () => {
      socket.off('task:created', handleCreated);
      socket.off('task:updated', handleUpdated);
    };
  }, [socket, projectId]);

  const createTask = useCallback(
    async (payload: Partial<Task>) => {
      if (!projectId) {
        toast.error('Select a project first');
        return;
      }
      try {
        await api.post('/tasks', { ...payload, projectId });
        toast.success('Task created');
      } catch (error) {
        console.error(error);
        toast.error('Failed to create task');
      }
    },
    [projectId],
  );

  const updateTask = useCallback(async (taskId: string, payload: Partial<Task>) => {
    try {
      const { data } = await api.put<Task>(`/tasks/update/${taskId}`, payload);
      setTasks((prev) => prev.map((task) => (task._id === taskId ? data : task)));
      toast.success('Task updated');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update task');
    }
  }, []);

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    refresh: fetchTasks,
  };
};
