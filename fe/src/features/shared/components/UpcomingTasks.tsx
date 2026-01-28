import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { fetchTasksByProjectID } from "../../tasks/tasks.api";

interface UpcomingTasksProps {
  projectIds: string[];
}

export function UpcomingTasks({ projectIds }: UpcomingTasksProps) {
  // Fetch tasks for all projects in parallel using useQueries
  const tasksQueries = useQueries({
    queries: projectIds.map(projectId => ({
      queryKey: ["tasks", projectId],
      queryFn: async () => {
        const res = await fetchTasksByProjectID(projectId);
        return res.data || [];
      },
    })),
  });

  const isLoading = tasksQueries.some(query => query.isLoading);

  // Combine and filter tasks
  const tasks = useMemo(() => {
    const allTasks = tasksQueries
      .filter(query => query.data)
      .flatMap(query => query.data || []);

    // Filter tasks have dueDate in the next 7 day
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return allTasks
      .filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate >= now && dueDate <= nextWeek;
      })
      .sort((a, b) => {
        if (!a.dueDate || !b.dueDate) return 0;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      })
      .slice(0, 5); // get 5 task nearest
  }, [tasksQueries]);

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("vi-VN", { month: "short", day: "numeric" });
  };

  const isOverdue = (date: string) => {
    return new Date(date) < new Date();
  };

  if (isLoading) {
    return (
      <div className="px-3 py-2 text-sm text-gray-400">
        Loading tasks...
      </div>
    );
  }

  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h3 className="px-3 py-2 text-xs font-semibold text-gray-600 uppercase">
        Upcoming Tasks
      </h3>
      <ul className="space-y-1 px-3">
        {tasks.map(task => (
          <li key={task.id}>
            <div className="text-sm p-2 rounded hover:bg-gray-50 cursor-pointer">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-xs text-gray-500 truncate">
                      {task.description}
                    </p>
                  )}
                </div>
                <span
                  className={`text-xs font-medium whitespace-nowrap px-2 py-1 rounded ${
                    isOverdue(task.dueDate || "")
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {formatDate(task.dueDate || "")}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
