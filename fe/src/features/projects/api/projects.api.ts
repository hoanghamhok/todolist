import api from "../../../api/client";
import type {
  CreateProjectRequest,
  UpdateProjectMemberRoleRequest,
} from "../types";

export const getProjectById = (id: string) =>
  api.get(`/projects/${id}`);

export const createProject = (data: CreateProjectRequest) =>
  api.post("/projects/create", data);

export const getUserProjects = (userId: string) =>
  api.get(`/projects/user/${userId}`);

export const getProjectDetails = (projectId: string) =>
  api.get(`/projects/details/${projectId}`);

export const updateProjectMemberRole = (
  projectId: string,
  data: UpdateProjectMemberRoleRequest
) =>
  api.patch(`/projects/update/${projectId}`, data);

export const removeProjectMember = (projectId: string) =>
  api.delete(`/projects/remove/${projectId}`);