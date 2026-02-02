import { useQuery } from "@tanstack/react-query";
import { getProjectMembers } from "../api/members.api";

export const useProjectMembers = (projectId: string) => {
  return useQuery({
    queryKey: ["projectmembers", projectId],
    queryFn: async () => {
      const res = await getProjectMembers(projectId);
      return res.data;
    },
    enabled: !!projectId,
  });
};
