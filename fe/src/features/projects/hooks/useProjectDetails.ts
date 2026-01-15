import { useQuery } from "@tanstack/react-query";
import { getProjectDetails } from "../api/projects.api";

export const useProjectDetails = (projectId: string) => {
  return useQuery({
    queryKey: ["projects", projectId],
    queryFn: () => getProjectDetails(projectId),
    enabled: !!projectId,
  });
};
