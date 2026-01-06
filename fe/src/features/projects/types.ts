import type {paths} from "../../types/openapi"

export type CreateProjectRequest =
  paths["/projects/create"]["post"]["requestBody"]["content"]["application/json"];

export type UpdateProjectMemberRoleRequest =
  paths["/projects/update/{projectId}"]["patch"]["requestBody"]["content"]["application/json"];

export type InviteMemberRequest =
  paths["/projectmembers/{projectId}/invite"]["post"]["requestBody"]["content"]["application/json"];