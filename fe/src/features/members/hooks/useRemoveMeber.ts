import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeMember } from "../api/members.api";

export const useRemoveMember = (projectId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (userId: string) => removeMember(projectId, userId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projectmembers", projectId],
      });
    },
  });

  return {
    removeMember: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
};
