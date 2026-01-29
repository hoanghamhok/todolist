import api from "../../../api/client"
import type { InviteMemberRequest } from "../../invitations/type";

export const acceptInvite = async (token: string) => {
  const res = await api.post(`/invites/accept/${token}`);
  return res.data;
};
export const rejectInvite = (token:string) =>
    api.post(`/invites/reject/${token}`)
export const inviteMember = (projectId: string,data: InviteMemberRequest) => {
  return api.post(`/invites/${projectId}/invite`, data);
};
