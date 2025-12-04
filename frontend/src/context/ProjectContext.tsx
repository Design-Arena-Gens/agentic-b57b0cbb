'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import type { Project } from '@/types';

interface ProjectContextValue {
  projects: Project[];
  selectedProject: Project | null;
  loading: boolean;
  selectProject: (projectId: string) => void;
  fetchProjects: () => Promise<void>;
  createProject: (payload: { name: string; description?: string; dueDate?: string }) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextValue | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Project[]>('/projects');
      setProjects(data);
      if (data.length) {
        setSelectedProject((prev) => prev ?? data[0]);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const selectProject = useCallback(
    (projectId: string) => {
      const project = projects.find((item) => item._id === projectId) ?? null;
      setSelectedProject(project);
    },
    [projects],
  );

  const createProject = useCallback(
    async (payload: { name: string; description?: string; dueDate?: string }) => {
      try {
        const { data } = await api.post<Project>('/projects', payload);
        setProjects((prev) => [data, ...prev]);
        setSelectedProject(data);
        toast.success('Project created');
      } catch (error) {
        console.error(error);
        toast.error('Failed to create project');
      }
    },
    [],
  );

  const value = useMemo(
    () => ({
      projects,
      selectedProject,
      loading,
      selectProject,
      fetchProjects,
      createProject,
    }),
    [projects, selectedProject, loading, selectProject, fetchProjects, createProject],
  );

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within ProjectProvider');
  }
  return context;
};
