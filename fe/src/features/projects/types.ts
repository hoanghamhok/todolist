import type { paths } from "../../types/openapi"

export type CreateProjectRequest =
  paths["/projects/create"]["post"]["requestBody"]["content"]["application/json"];

export type UpdateProjectMemberRoleRequest =
  paths["/projects/update/{projectId}"]["patch"]["requestBody"]["content"]["application/json"];

export type InviteMemberRequest =
  paths["/projectmembers/{projectId}/invite"]["post"]["requestBody"]["content"]["application/json"];

export interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  ownerId: string;
}

export type ProjectRole = "OWNER" | "ADMIN" | "MEMBER";

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: ProjectRole;
  joinedAt: string;
  project: Project;
}
