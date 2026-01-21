import api from "../../../api/client";
import type {
  CreateProjectRequest
} from "../types";

export const getProjectById = (id: string) =>
  api.get(`/projects/${id}`);

export const createProject = (data: CreateProjectRequest) =>
  api.post("/projects/create", data);

export const getUserProjects = () =>
  api.get(`/projects/my`);

export const getProjectDetails = (projectId: string) =>
  api.get(`/projects/details/${projectId}`);

export const removeProjectMember = (projectId: string) =>
  api.delete(`/projects/remove/${projectId}`);