import { useQuery } from "@tanstack/react-query";
import { getUserProjects } from "../api/projects.api";
import { useAuth } from "../../auth/hooks/useAuth";

export const useProjects = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["projects", user?.id],
    queryFn: () => getUserProjects(user!.id),
    enabled: !!user?.id,
    select: (res) => res.data,
  });
};
