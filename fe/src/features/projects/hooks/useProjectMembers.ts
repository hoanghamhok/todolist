import { useQuery } from "@tanstack/react-query";
import { getProjectMembers } from "../api/members.api";

export const useProjectMembers = (projectId: string) => {
  return useQuery({
    queryKey: ["projectMembers", projectId],
    queryFn: () => getProjectMembers(projectId),
    enabled: !!projectId,
  });
};
