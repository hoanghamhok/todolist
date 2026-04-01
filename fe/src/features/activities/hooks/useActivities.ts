import { useQuery } from "@tanstack/react-query";
import api from "../../../api/client";
import { useAuth } from "../../auth/hooks/useAuth";

export const getAllActivities = () =>
  api.get(`/activity-logs/activities`);

export const useActivities = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      const res = await getAllActivities();
      return res.data;
    },
    enabled: !!user,
  });
};