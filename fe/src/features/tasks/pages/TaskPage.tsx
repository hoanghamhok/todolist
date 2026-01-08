import { TaskColumn } from "../components/TaskColumn";
import { TaskForm } from "../components/TaskForm";
import { useTask } from "../hooks/useTasks";
import { useColumn } from "../../columns/hooks/useColumn"
import { useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
  type DragCancelEvent,
} from "@dnd-kit/core";
import type { Task } from "../types";

function TaskCardOverlay({ task }: { task: Task }) {
  return (
    <div style={{ width: 320, pointerEvents: "none" }}>
      <div className="card cardDragging">
        <div className="cardTop">
          <strong className="cardTitle">{task.title}</strong>
        </div>
      </div>
    </div>
  );
}

export function TaskPage() {
  const projectId = "abc123"; // 👈 lấy từ router / context
  const userId = "u123"; // từ auth / context
  const { tasks, add, remove, edit, move } = useTask();
  const { columns, loading: colLoading, error: colError } =useColumn(projectId);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const [activeId, setActiveId] = useState<string | null>(null);

  const activeTask = useMemo(
    () => (activeId ? tasks.find(t => t.id === activeId) : undefined),
    [activeId, tasks]
  );

  // group task theo columnId
  const tasksByColumn = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const col of columns) map[col.id] = [];
    for (const t of tasks) map[t.columnId]?.push(t);
    Object.values(map).forEach(col =>
      col.sort((a, b) => a.position - b.position)
    );
    return map;
  }, [tasks, columns]);

  const onDragStart = useCallback((e: DragStartEvent) => {
    setActiveId(String(e.active.id));
  }, []);

  const onDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const onDragEnd = useCallback(
    (e: DragEndEvent) => {
      setActiveId(null);
      const { active, over } = e;
      if (!over) return;

      const taskId = String(active.id);
      const activeTask = tasks.find(t => t.id === taskId);
      if (!activeTask) return;

      // drop lên column
      if (over.data.current?.type === "COLUMN") {
        move(taskId, over.data.current.columnId);
        return;
      }

      // drop lên task
      if (over.data.current?.type === "TASK") {
        const targetColumnId = over.data.current.columnId;
        const targetTaskId = over.data.current.taskId;
        const colTasks = tasksByColumn[targetColumnId];
        const idx = colTasks.findIndex(t => t.id === targetTaskId);

        move(
          taskId,
          targetColumnId,
          colTasks[idx - 1]?.id,
          colTasks[idx]?.id
        );
      }
    },
    [tasks, tasksByColumn, move]
  );

  const handleAddTask = useCallback(
    async ({ title, description, columnId }: {
      title: string;
      description?: string;
      columnId: string;
    }): Promise<void> => {
      await add(
        columnId,
        title,
        userId,
        projectId,
        description ?? ""
      );
    },
    [add, projectId, userId]
  );
  
  const handleEditTask = useCallback(
  async (
    id: string,
    data: Partial<Pick<Task, "title" | "description">>
  ): Promise<void> => {
    await edit(id, data);
  },
  [edit]
  );

  if (colLoading) return <div>Loading board...</div>;
  if (colError) return <div>Error loading columns</div>;
  return (
    <div className="app-wrapper">
      <TaskForm columns={columns} onSubmit={handleAddTask} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={onDragCancel}
      >
        <div className="columns">
          {columns.map(col => (
            <TaskColumn
              key={col.id}
              column={col}
              tasks={tasksByColumn[col.id] ?? []}
              onDelete={remove}
              onEdit={handleEditTask}
            />
          ))}
        </div>

        {createPortal(
          <DragOverlay>
            {activeTask ? <TaskCardOverlay task={activeTask} /> : null}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}
