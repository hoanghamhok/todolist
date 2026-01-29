import type { paths } from "../../types/openapi"

export type Invitation = {
    id:string;
    token:string;
}

export type InviteMemberRequest= paths["/invites/{projectId}/invite"]["post"]["requestBody"]["content"]["application/json"]