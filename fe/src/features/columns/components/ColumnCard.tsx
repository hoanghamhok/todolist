import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TaskCard } from "../../tasks/components/TaskCard";
import { useTask } from "../../tasks/hooks/useTasks";
import { useColumn } from "../hooks/useColumn";
import { useState } from "react";
import { TaskForm } from "../../tasks/components/TaskForm";
import { useConfirm } from "../../shared/components/ConfirmContext";
import { ColumnForm } from "./ColumnForm";

interface ColumnCardProps {
  columnId: string;
  projectId: string;
}

export function ColumnCard({ columnId, projectId }: ColumnCardProps) {
  const [isEditingColumn, setIsEditingColumn] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);

  const { columns, remove, markAsDone } = useColumn(projectId);
  const { tasks } = useTask(projectId);
  const { openConfirm } = useConfirm();

  const column = columns.find((c) => c.id === columnId);

  const taskInCol = tasks
    .filter((t) => t.columnId === columnId)
    .sort((a, b) => a.position - b.position);
  const taskIds = taskInCol.map((t) => t.id);
  const taskcount = taskInCol.length;

  const { setNodeRef } = useDroppable({ id: columnId });

  if (!column) return null;

  const isDone = column.closed === true;

  const hasDoneColumn = columns.some((c) => c.closed === true);

  return (
    <>
      {isAddingTask && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="animate-in zoom-in-95 duration-200">
            <TaskForm
              projectId={projectId}
              columnId={columnId}
              onClose={() => setIsAddingTask(false)}
            />
          </div>
        </div>
      )}

      <div
        className={`
          relative rounded-2xl w-80 flex-shrink-0 flex flex-col max-h-[calc(100vh-230px)]
          transition-all duration-300 ease-out 
          ${
            isDone
              ? "bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 shadow-lg shadow-green-100/50"
              : "bg-white border border-gray-200/80 shadow-sm hover:shadow-md"
          }
        `}
      >
        {/* Done badge */}
        {isDone && (
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md animate-bounce-once z-0">
            ✓ Done
          </div>
        )}

        {/* Header */}
        <div className="p-4 pb-2">
          {isEditingColumn ? (
            <ColumnForm
              projectId={projectId}
              columnId={column.id}
              initialTitle={column.title}
              onSuccess={() => setIsEditingColumn(false)}
            />
          ) : (
            <div className="flex justify-between items-center gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <h3
                  className={`
                  font-semibold text-lg truncate transition-colors
                  ${isDone ? "text-green-700" : "text-gray-800"}
                `}
                >
                  {column.title}
                </h3>
                <span
                  className={`
                  text-xs font-medium px-2 py-0.5 rounded-full shadow-sm
                  ${
                    isDone
                      ? "bg-green-200 text-green-800"
                      : "bg-indigo-100 text-indigo-700"
                  }
                `}
                >
                  {taskcount}
                </span>
              </div>

              <div className="flex gap-1.5 flex-shrink-0">
                {/* Edit */}
                <button
                  onClick={() => setIsEditingColumn(true)}
                  className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 hover:scale-105"
                  title="Edit column"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>

                {/* ✅ Mark as Done (only show if no other column is done OR this one is done) */}
                {(!hasDoneColumn || isDone) && (
                  <button
                    onClick={() => markAsDone(columnId)}
                    className={`
                      p-1.5 rounded-lg transition-all duration-200 hover:scale-105
                      ${
                        isDone
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                      }
                    `}
                    title={isDone ? "Already done" : "Mark as done"}
                    disabled={isDone}
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </button>
                )}

                {/* Delete */}
                <button
                  onClick={() =>
                    openConfirm({
                      title: "Delete Column",
                      message: `Are you sure you want to delete "${column.title}"?`,
                      confirmText: "Delete",
                      onConfirm: async () => {
                        await remove(columnId);
                      },
                    })
                  }
                  className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200 hover:scale-105"
                  title="Delete column"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Add Task */}
        <div className="px-4 pb-2">
          <button
            onClick={() => setIsAddingTask(true)}
            className="w-full text-sm py-2 border border-dashed rounded-xl transition-all duration-200 flex items-center justify-center gap-1 group
              border-gray-300 text-gray-500 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <svg
              className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Add Task</span>
          </button>
        </div>

        {/* Tasks */}
        <div
          ref={setNodeRef}
          className="flex-1 overflow-y-auto px-2 pb-4 space-y-3 min-h-[150px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400"
        >
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            {taskInCol.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm italic">
                No tasks yet
              </div>
            ) : (
              taskInCol.map((task) => (
                <TaskCard
                  key={task.id}
                  taskId={task.id}
                  projectId={projectId}
                />
              ))
            )}
          </SortableContext>
        </div>

        {/* Footer */}
        {isDone && (
          <div className="h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-b-2xl"></div>
        )}
      </div>
    </>
  );
}