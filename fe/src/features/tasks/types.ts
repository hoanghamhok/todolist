export type TaskStatus = 'TODO' | 'INPROGRESS' | 'DONE';

export type Task = {
  id: string;
  title: string;
  description?: string;

  created_at: string;
  updated_at: string;

  status: TaskStatus;
  order: number;
};

export type CreateTaskDto = {
  title: string;
  description?: string;
  status?: TaskStatus;
};

export type UpdateTaskDto = Partial<CreateTaskDto>;

export type UpdateTaskStatusDto = {
  status: TaskStatus;
};

export type ReorderTaskDto = {
  id: string;
  order: number;
};

export type ReorderTaskPayload = { 
  id: string; 
  status: TaskStatus; 
  order: number 
};
