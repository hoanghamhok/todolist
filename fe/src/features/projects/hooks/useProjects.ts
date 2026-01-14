import { useQuery } from "@tanstack/react-query";
import { getUserProjects } from "../api/projects.api";
import { useAuth } from "../../auth/hooks/useAuth";
import type { ProjectMember } from "../types";

export const useProjects = () => {
  const { user } = useAuth();

  return useQuery<ProjectMember[]>({
    queryKey: ["projects"],
    queryFn: async () =>{
      const res = await getUserProjects();
      return res.data;
    },
    enabled: !!user,
  });
};
