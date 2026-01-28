import { useQuery } from "@tanstack/react-query";
import { getProjectMembers } from "../../members/api/members.api";

export const useProjectMembers = (projectId: string) => {
  return useQuery({
    queryKey: ["projectMembers", projectId],
    queryFn: () => getProjectMembers(projectId),
    enabled: !!projectId,
  });
};
