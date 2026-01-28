import api from "../../../api/client"
import type { InviteMemberRequest } from "../../projects/types";

export const getProjectMembers = (projectId: string) =>
  api.get(`/projectmembers/${projectId}/members`);

export const inviteMember = (projectId: string,data: InviteMemberRequest) => {
  return api.post(`/invites/${projectId}/invite`, data);
};

export const removeMember = (projectId: string, userId: string) =>
  api.delete(`/projectmembers/${projectId}/members/${userId}`);

export const leaveProject = (projectId: string) =>
  api.post(`/projectmembers/${projectId}/leave`);