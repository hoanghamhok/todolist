import api from "../../../api/client"
import type { InviteMemberRequest } from "../types";

export const getProjectMembers = (projectId: string) =>
  api.get(`/projectmembers/${projectId}/members`);

export const inviteMember = (
  projectId: string,
  data: InviteMemberRequest
) =>
  api.post(`/projectmembers/${projectId}/invite`, data);

export const removeMember = (projectId: string, userId: string) =>
  api.delete(`/projectmembers/${projectId}/members/${userId}`);

export const leaveProject = (projectId: string) =>
  api.post(`/projectmembers/${projectId}/leave`);