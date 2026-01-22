import { useEffect, useState } from "react";
import { fetchTasksByProjectID } from "../../tasks/tasks.api";
import type { Task } from "../../tasks/types";

interface UpcomingTasksProps {
  projectIds: string[];
}

export function UpcomingTasks({ projectIds }: UpcomingTasksProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (projectIds.length === 0) return;

    const loadTasks = async () => {
      setIsLoading(true);
      try {
        // Fetch all task
        const allTasks: Task[] = [];
        
        for (const projectId of projectIds) {
          try {
            const res = await fetchTasksByProjectID(projectId);
            allTasks.push(...(res.data || []));
          } catch (err) {
            console.error(`Failed to load tasks for project ${projectId}:`, err);
          }
        }

        // Filter tasks have dueDate in the next 7 day
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        const upcomingTasks = allTasks
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

        setTasks(upcomingTasks);
      } catch (error) {
        console.error("Load tasks failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [projectIds]);

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
