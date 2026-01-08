import { useMemo } from "react";
import {useQuery,useMutation,useQueryClient} from "@tanstack/react-query";
import type { Task } from "../types";
import {fetchTasks,createTask,updateTask,deleteTask,moveTask} from "../tasks.api";

export function useTask() {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery<Task[]>({
    queryKey:["tasks"],
    queryFn:async() =>{
      const res = await fetchTasks();
      return res.data;
    }
  })

  const addMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"],});
    },
  });

  const add = (columnId: string,title: string,userId: string,projectId: string,description: string) => {
    if (!columnId) throw new Error("columnId is required");
    return addMutation.mutateAsync({title,description,columnId,userId,projectId,});
  };
  

  const editMutation = useMutation({
    mutationFn: ({ id, data }: any) => updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["tasks"]});
    },
  });

  const edit = (id: string, data: Partial<Task>) => {
    return editMutation.mutateAsync({ id, data });
  };

  const removeMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["tasks"]});
    },
  });

  const remove = (id: string) => {
    return removeMutation.mutateAsync(id);
  };

  const moveMutation = useMutation({
    mutationFn: ({ taskId, payload }: any) =>
      moveTask(taskId, payload),

    onMutate: async ({ taskId, columnId }) => {
      await queryClient.cancelQueries({queryKey:["tasks"]});

      const prevTasks =
        queryClient.getQueryData<Task[]>(["tasks"]);

      queryClient.setQueryData<Task[]>(["tasks"], old =>
        old?.map(t =>
          t.id === taskId ? { ...t, columnId } : t
        )
      );

      return { prevTasks };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prevTasks) {
        queryClient.setQueryData(["tasks"], ctx.prevTasks);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({queryKey:["tasks"]});
    },
  });

  const move = (
    taskId: string,
    columnId: string,
    beforeTaskId?: string,
    afterTaskId?: string
  ) => {
    return moveMutation.mutateAsync({
      taskId,
      payload: { columnId, beforeTaskId, afterTaskId },
    });
  };

  // Group tasks by column
  const byColumn = useMemo(() => {
    const map: Record<string, Task[]> = {};
    const tasks = tasksQuery.data ?? [];

    for (const t of tasks) {
      if (!map[t.columnId]) map[t.columnId] = [];
      map[t.columnId].push(t);
    }

    Object.values(map).forEach(col =>
      col.sort((a, b) => a.position - b.position)
    );

    return map;
  }, [tasksQuery.data]);

   return {
    tasks: tasksQuery.data ?? [],
    byColumn,
    loading: tasksQuery.isLoading,
    error: tasksQuery.error,
    reload: tasksQuery.refetch,
    add,
    edit,
    remove,
    move,
  };
}
