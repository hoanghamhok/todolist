import { useQuery } from "@tanstack/react-query";
import { fetchMyTasks } from "../tasks.api";
import type { Task } from "../types";
import { useAuth } from "../../auth/hooks/useAuth";

export const useMyTasks = () => {
  const { user } = useAuth();

  return useQuery<Task[]>({
    queryKey: ["tasks", "me"],
    queryFn: async () => {
      const res = await fetchMyTasks();
      return res.data;
    },
    enabled: !!user,
  });
};