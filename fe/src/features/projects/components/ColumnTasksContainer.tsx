import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import type { Task } from "../../tasks/types";
import { TaskCard } from "../../tasks/components/TaskCard";

interface ColumnTasksContainerProps {
  columnId: string;
  tasks: Task[];
  editingTaskId: string | null;
  renderEditForm: (task: Task) => React.ReactNode;
  assignees: any[];
  addTask: (columnId: string, title: string, assigneeIds?: string[]) => void;
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string, taskTitle: string) => void;
}

export function ColumnTasksContainer({
  columnId,
  tasks,
  editingTaskId,
  renderEditForm,
  assignees,
  addTask,
  onEditTask,
  onDeleteTask,
}: ColumnTasksContainerProps) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskAssignees, setNewTaskAssignees] = useState<string[]>([]);
  const { setNodeRef } = useDroppable({id: columnId});
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

      {/* Add Task Button */}
      <div className="mt-3">
        {isAddingTask ? (
          <div className="bg-white p-2 rounded shadow-sm space-y-2">
            <input
              autoFocus
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Task title"
              className="w-full px-2 py-1 rounded border text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (!newTaskTitle.trim()) return;
                  addTask(columnId, newTaskTitle.trim(), newTaskAssignees);
                  setNewTaskTitle("");
                  setNewTaskAssignees([]);
                  setIsAddingTask(false);
                }
                if (e.key === "Escape") {
                  setIsAddingTask(false);
                  setNewTaskTitle("");
                  setNewTaskAssignees([]);
                }
              }}
            />
            <div className="flex flex-wrap gap-2">
              {assignees.map((m: any) => (
                <button
                  key={m.id}
                  onClick={() =>
                    setNewTaskAssignees(prev =>
                      prev.includes(m.userId)
                        ? prev.filter(id => id !== m.userId)
                        : [...prev, m.userId]
                    )
                  }
                  className={`px-2 py-1 text-xs rounded ${newTaskAssignees.includes(m.userId) ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                  {m.user?.username}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (!newTaskTitle.trim()) return;
                  addTask(columnId, newTaskTitle.trim(), newTaskAssignees);
                  setNewTaskTitle("");
                  setNewTaskAssignees([]);
                  setIsAddingTask(false);
                }}
                className="px-3 py-1 bg-blue-500 text-white text-xs rounded"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setIsAddingTask(false);
                  setNewTaskTitle("");
                  setNewTaskAssignees([]);
                }}
                className="px-3 py-1 text-gray-500 text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingTask(true)}
            className="w-full py-2 text-gray-600 text-sm hover:bg-gray-200 rounded transition"
          >
            + Add Task
          </button>
        )}
      </div>
    </div>
  );
}
