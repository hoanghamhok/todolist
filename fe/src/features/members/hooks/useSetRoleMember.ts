import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setRoleMember} from "../api/members.api";
import type { ProjectRole } from "../api/members.api";

export const useSetRoleMember = (projectId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({targetUserId,role}: {
      targetUserId: string;
      role: ProjectRole;
    }) => await setRoleMember(projectId, targetUserId, role),

    onSuccess: (_, variables) => {
      queryClient.setQueryData(
        ["projectmembers", projectId],
        (old: any) => {
          if (!old) return old;

          // Trường hợp cache là AxiosResponse
          if (Array.isArray(old.data)) {
            return {
              ...old,
              data: old.data.map((m: any) =>
                m.userId === variables.targetUserId
                  ? { ...m, role: variables.role }
                  : m
              ),
            };
          }

          // Trường hợp cache là array trực tiếp
          if (Array.isArray(old)) {
            return old.map((m: any) =>
              m.userId === variables.targetUserId
                ? { ...m, role: variables.role }
                : m
            );
          }

          return old;
        }
      );
    },
  });

  return {
    setRole: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,//có lỗi hay không
    error: mutation.error,//lỗi là gì
    isSuccess: mutation.isSuccess,
  };
};
