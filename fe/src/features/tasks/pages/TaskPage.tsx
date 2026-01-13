import { TaskColumn } from "../components/TaskColumn";
import { TaskForm } from "../components/TaskForm";
import { useTask } from "../hooks/useTasks";
import { useColumn } from "../../columns/hooks/useColumn";
import { useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../auth/hooks/useAuth";
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
  const projectId = "cmk4sj4q50000waq904ix2eqr"; // TODO: lấy từ router
  const { user } = useAuth();
  const userId = user?.id || "";

  const {
    tasks,
    byColumn,
    add,
    remove,
    edit,
    move,
  } = useTask(projectId);

  const {
    columns,
    loading: colLoading,
    error: colError,
  } = useColumn(projectId);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  const [activeId, setActiveId] = useState<string | null>(null);

  const activeTask = useMemo(
    () => (activeId ? tasks.find(t => t.id === activeId) : undefined),
    [activeId, tasks]
  );

  /* =======================
     DND HANDLERS
  ======================= */
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

      // Drop lên column
      if (over.data.current?.type === "COLUMN") {
        move(taskId, over.data.current.columnId);
        return;
      }

      // Drop lên task
      if (over.data.current?.type === "TASK") {
        const targetColumnId = over.data.current.columnId;
        const targetTaskId = over.data.current.taskId;

        const colTasks = byColumn[targetColumnId] ?? [];
        const idx = colTasks.findIndex(t => t.id === targetTaskId);

        move(
          taskId,
          targetColumnId,
          colTasks[idx - 1]?.id,
          colTasks[idx]?.id
        );
      }
    },
    [tasks, byColumn, move]
  );

  /* =======================
     CRUD HANDLERS
  ======================= */
  const handleAddTask = useCallback(
    async ({
      title,
      description,
      columnId,
    }: {
      title: string;
      description?: string;
      columnId: string;
    }) => {
      await add(
        columnId,
        title,
        userId,
        projectId,
        description ?? ""
      );
    },
    [add, userId, projectId]
  );

  const handleEditTask = useCallback(
    async (
      id: string,
      data: Partial<Pick<Task, "title" | "description">>
    ) => {
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
              tasks={byColumn[col.id] ?? []}
              onDelete={remove}
              onEdit={handleEditTask}
            />
          ))}
        </div>

        {createPortal(
          <DragOverlay>
            {activeTask ? (
              <TaskCardOverlay task={activeTask} />
            ) : null}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}
