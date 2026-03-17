export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: TaskPriority;
  createdAt: Date;
  dueDate?: Date;
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export type TaskStatus = 'all' | 'active' | 'completed';
