import type { paths } from "../../types/openapi"
import type { JsonResponse } from "../../types/openapi-helpers";

export type CreateTaskRequest =
  paths["/tasks/create"]["post"]["requestBody"]["content"]["application/json"];
export type UpdateTaskRequest =
  paths["/tasks/{id}"]["patch"]["requestBody"]["content"]["application/json"];
export type GetTasksResult =
  JsonResponse<"/tasks/{id}", "get", 200>;
export type GetTaskDetailResult =
  JsonResponse<"/tasks/{id}", "get", 200>;
export type CreateTaskResult =
  JsonResponse<"/tasks/create", "post", 201>;
export type UpdateTaskResult =
  JsonResponse<"/tasks/{id}", "patch", 200>;
export type DeleteTaskResult =
  JsonResponse<"/tasks/{id}", "delete", 200>;

export interface Task {
  id:string;
  title:string;
  description:string;
  columnId:string;
  position:number;
  createdAt?:string;
  updateAt?:string;
}

export type Column = {
  id: string;
  title: string;
  position: number;
};



