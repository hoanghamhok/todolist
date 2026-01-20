import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Task } from "../../tasks/types";
import { TaskCard } from "../../tasks/components/TaskCard";

interface ColumnTasksContainerProps {
  columnId: string;
  tasks: Task[];
  editingTaskId: string | null;
  renderEditForm: (task: Task) => React.ReactNode;
  assignees: any[];
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string, taskTitle: string) => void;
}

export function ColumnTasksContainer({
  columnId,
  tasks,
  editingTaskId,
  renderEditForm,
  assignees,
  onEditTask,
  onDeleteTask,
}: ColumnTasksContainerProps) {
  const { setNodeRef } = useDroppable({
    id: columnId,
  });

  return (
    <div
      ref={setNodeRef}
      className="space-y-2 mb-2 min-h-32 rounded-lg border-2 border-dashed border-transparent hover:border-gray-300 transition p-1"
    >
      <SortableContext
        items={tasks.map(t => t.id)}
        strategy={verticalListSortingStrategy}
      >
        {tasks.map(task => (
          editingTaskId === task.id ? (
            renderEditForm(task)
          ) : (
            <TaskCard
              key={task.id}
              task={task}
              assignees={assignees}
              onEdit={() => onEditTask(task.id)}
              onDelete={() => onDeleteTask(task.id, task.title)}
            />
          )
        ))}
      </SortableContext>
    </div>
  );
}
