import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { fetchTasksByProjectID } from "../../tasks/tasks.api";
import { useNavigate } from "react-router-dom";

interface UpcomingTasksProps {
  projectIds: string[];
}

export function UpcomingTasks({ projectIds }: UpcomingTasksProps) {
  const navigate = useNavigate();

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

    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return allTasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);

      return dueDate <= nextWeek;
    }).sort((a, b) => {
    if (!a.dueDate || !b.dueDate) return 0;

    const aDate = new Date(a.dueDate).getTime();
    const bDate = new Date(b.dueDate).getTime();
    const now = Date.now();

    const aOverdue = aDate < now;
    const bOverdue = bDate < now;

    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;

    return aDate - bDate;
  })
  .slice(0, 5);
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
      <h3 className="px-6 py-2 text-sm font-bold text-black-500 uppercase">
        Your Tasks
      </h3>
      <ul className="space-y-1 px-3">
        {tasks.map(task => (
          <li key={task.id}>
            <div
              onClick={() => navigate(`/projects/${task.projectId}`)}
              className="text-sm p-2 pl-5 rounded hover:bg-gray-50 cursor-pointer">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${
                      isOverdue(task.dueDate || "")
                        ? "text-red-400 italic"
                        : "text-black-200"
                    }`}
                  >
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-xs text-black-500 truncate">
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
                {isOverdue(task.dueDate || "")
                  ? `Quá hạn · ${formatDate(task.dueDate || "")}`
                  : `Sắp đến hạn ${formatDate(task.dueDate || "")} `}
              </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
