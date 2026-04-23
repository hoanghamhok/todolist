import type { paths } from "../../types/openapi"
import type { JsonResponse } from "../../types/openapi-helpers";

export type CreateTaskRequest =
  paths["/tasks"]["post"]["requestBody"]["content"]["application/json"];
export type UpdateTaskRequest =
  paths["/tasks/{id}"]["patch"]["requestBody"]["content"]["application/json"];
export type GetTasksResult =
  JsonResponse<"/tasks/{id}", "get", 200>;
export type GetTaskDetailResult =
  JsonResponse<"/tasks/{id}", "get", 200>;
export type CreateTaskResult =
  JsonResponse<"/tasks", "post", 201>;
export type UpdateTaskResult =
  JsonResponse<"/tasks/{id}", "patch", 200>;
export type DeleteTaskResult =
  JsonResponse<"/tasks/{id}", "delete", 200>;

export interface Task {
  id:string;
  title:string;
  description:string;
  columnId:string;
  projectId: string;
  column: {
    id: string;
    title: string;
    position: number;
  };
  position:number;
  createdAt?:string;
  updateAt?:string;
  assigneeIds: string[];
  dueDate?: string;
  completedAt?: string;
  difficulty: number;
  estimateHours: number;
  blocked: boolean;
  blockedAt?: string;
  blockedReason?: string;
  blockedBy?: string;
  dependencyCount?: number;
  unresolvedDependencies?: number;
  isBlockedByDependency?: boolean;
}

export type Column = {
  id: string;
  title: string;
  position: number;
};



