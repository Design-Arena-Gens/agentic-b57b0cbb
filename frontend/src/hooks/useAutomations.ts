'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import type { AutomationRule } from '@/types';

export const useAutomations = (projectId: string | null) => {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRules = useCallback(async () => {
    if (!projectId) {
      setRules([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get<AutomationRule[]>(`/automations/${projectId}`);
      setRules(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch automation rules');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const createRule = useCallback(
    async (payload: Partial<AutomationRule>) => {
      if (!projectId) {
        toast.error('Select a project first');
        return;
      }

      try {
        const { data } = await api.post<AutomationRule>('/automations', payload);
        setRules((prev) => [data, ...prev]);
        toast.success('Automation created');
      } catch (error) {
        console.error(error);
        toast.error('Failed to create automation');
      }
    },
    [projectId],
  );

  const toggleRule = useCallback(async (ruleId: string) => {
    try {
      const { data } = await api.patch<AutomationRule>(`/automations/toggle/${ruleId}`);
      setRules((prev) => prev.map((rule) => (rule._id === data._id ? data : rule)));
    } catch (error) {
      console.error(error);
      toast.error('Failed to update rule');
    }
  }, []);

  return { rules, loading, fetchRules, createRule, toggleRule };
};
