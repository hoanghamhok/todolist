export type NotificationType =
  | "INVITE_RECEIVED"
  | "PROJECT_UPDATED"
  | "TASK_ASSIGNED";

export interface Notification {
  id: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  data:{
    message:string;
  }
}