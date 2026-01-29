import api from "../../../api/client"

export const getProjectMembers = (projectId: string) =>
  api.get(`/projectmembers/${projectId}/members`);

export const removeMember = (projectId: string, userId: string) =>
  api.delete(`/projectmembers/${projectId}/members/${userId}`);

export const leaveProject = (projectId: string) =>
  api.post(`/projectmembers/${projectId}/leave`);