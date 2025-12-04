export type UserRole = 'admin' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarColor: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Task {
  _id: string;
  title: string;
  description: string;
  project: string;
  assignee?: User;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  completedAt?: string;
  activityLog: { message: string; createdAt: string }[];
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed';

export interface Project {
  _id: string;
  name: string;
  description: string;
  owner: User;
  members: User[];
  status: ProjectStatus;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  tasks?: Task[];
}

export interface AutomationCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'gte' | 'lte' | 'changed';
  value: string;
}

export interface AutomationAction {
  type: 'update_status' | 'assign_user' | 'notify' | 'add_comment';
  payload: Record<string, unknown>;
}

export interface AutomationRule {
  _id: string;
  name: string;
  project: string;
  trigger: {
    event: string;
    conditions: AutomationCondition[];
  };
  actions: AutomationAction[];
  isActive: boolean;
  lastRunAt?: string;
  creator: User;
}

export interface ChatLog {
  _id: string;
  project: string;
  user?: string;
  role: 'user' | 'assistant' | 'system';
  message: string;
  createdAt: string;
}
