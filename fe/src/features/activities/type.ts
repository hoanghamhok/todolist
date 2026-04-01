export type ActivityType = "comment" | "task_moved" | "task_completed";

export type Activity = {
  id: string;
  type: ActivityType;
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  target: {
    name: string;
    link: string;
  };
  project?: {
    name: string;
  };
  details?: {
    comment?: string;
    taskStatus?: string;
  };
  timestamp: string;
};