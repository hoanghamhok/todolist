import { TaskColumn } from "./TaskColumn";
import { TaskForm } from "./TaskForm";
import { useTask } from "../hooks/useTasks";
import type { TaskStatus } from "../types";

import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

const STATUSES: TaskStatus[] = ["TODO", "INPROGRESS", "DONE"];

function findStatusOfTask(tasks: { id: string; status: TaskStatus }[], taskId: string) {
  return tasks.find(t => t.id === taskId)?.status;
}

export function TaskPage() {
  const { tasks, grouped, loading, error, add, remove, changeStatus, reload, reorderLocal, reorder } = useTask();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <div>
        Error: {error} <button onClick={reload}>Retry</button>
      </div>
    );

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) return;

    const activeStatus = findStatusOfTask(tasks, activeId);
    if (!activeStatus) return;

    // over có thể là: taskId hoặc columnId(status)
    const overStatus =
      (STATUSES.includes(overId as TaskStatus) ? (overId as TaskStatus) : findStatusOfTask(tasks, overId)) ?? activeStatus;

    // Lấy danh sách task của 2 cột
    const from = grouped[activeStatus].map(t => t.id);
    const to = grouped[overStatus].map(t => t.id);

    const fromIndex = from.indexOf(activeId);

    // Nếu kéo lên 1 TASK cụ thể thì chèn trước vị trí đó, nếu kéo vào column rỗng -> cuối cột
    const overIndexInTo = STATUSES.includes(overId as TaskStatus) ? to.length : to.indexOf(overId);
    const insertIndex = overIndexInTo < 0 ? to.length : overIndexInTo;

    // Tạo mảng tasks mới
    const next = [...tasks];

    // remove active task
    const moving = next.find(t => t.id === activeId);
    if (!moving) return;

    // cập nhật status ngay trên object moving
    moving.status = overStatus;

    // rebuild orders for both columns based on new sequence
    const nextFromIds = activeStatus === overStatus ? to : from.filter(id => id !== activeId);
    const nextToIds = activeStatus === overStatus
      ? arrayMove(to, fromIndex, insertIndex)
      : (() => {
          const clone = [...to];
          clone.splice(insertIndex, 0, activeId);
          return clone;
        })();

    // apply order for columns
    for (const s of STATUSES) {
      const ids = s === activeStatus ? nextFromIds : s === overStatus ? nextToIds : grouped[s].map(t => t.id);
      ids.forEach((id, idx) => {
        const tt = next.find(x => x.id === id);
        if (tt) {
          tt.status = s;
          tt.order = idx;
        }
      });
    }

    const normalized = reorderLocal(next);

    // gọi API reorder (nếu fail thì reload lại)
    try {
      await reorder(normalized);
    } catch {
      await reload();
    }
  };

  return (
    <div className="app-wrapper">
      <div className="app-container">
        <h1>Tasks</h1>
        <TaskForm onSubmit={add} />
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={onDragEnd}>
          <div className="columns">
            <TaskColumn title="TODO" tasks={grouped.TODO} onDelete={remove} onChangeStatus={changeStatus} />
            <TaskColumn title="INPROGRESS" tasks={grouped.INPROGRESS} onDelete={remove} onChangeStatus={changeStatus} />
            <TaskColumn title="DONE" tasks={grouped.DONE} onDelete={remove} onChangeStatus={changeStatus} />
          </div>
        </DndContext>
      </div>
    </div>
  );
}
