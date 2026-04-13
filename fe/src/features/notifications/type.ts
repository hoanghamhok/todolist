export type NotificationType =
  | "INVITE_RECEIVED"
  | "PROJECT_UPDATED"
  | "TASK_ASSIGNED"
  | "COMMENT_MENTION"
  | "COMMENT_REPLY"
  | "TASK_COMMENT";

export interface Notification {
  id: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  data: {
    message: string;
    inviteToken?: string;
    [key: string]: any;
  };
}