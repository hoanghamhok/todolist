import { useQuery } from "@tanstack/react-query";
import api from "../../../api/client";

export const useProjectActivities = (projectId: string) => {
  return useQuery({
    queryKey: ["project-activities", projectId],
    queryFn: async () => {
      const res = await api.get(`/activity-logs/${projectId}/activities`);
      return res.data;
    },
    enabled: !!projectId,
  });
};