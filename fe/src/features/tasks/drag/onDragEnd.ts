import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { Task, TaskStatus } from "../types";

type Params = {
  event: DragEndEvent;
  tasks: Task[];
  grouped: Record<TaskStatus, Task[]>;
  reorder: (tasks: Task[]) => Promise<void>;
  reload: () => Promise<void>;
  reorderLocal: (tasks: Task[]) => Task[];
  findStatusOfTask: (tasks: { id: string; status: TaskStatus }[], taskId: string) => TaskStatus | undefined;
};

const STATUSES: TaskStatus[] = ["TODO", "INPROGRESS", "DONE"];

export async function handleDrag({
  event,
  tasks,
  grouped,
  reorder,
  reload,
  reorderLocal,
  findStatusOfTask,
}: Params) {
  const { active, over } = event;
  if (!over) return;

  const activeId = String(active.id);
  const overId = String(over.id);
  if (activeId === overId) return;

  const activeStatus = findStatusOfTask(tasks, activeId);
  if (!activeStatus) return;

  const overStatus =
    (STATUSES.includes(overId as TaskStatus)
      ? (overId as TaskStatus)
      : findStatusOfTask(tasks, overId)) ?? activeStatus;

  const from = grouped[activeStatus].map((t) => t.id);
  const to = grouped[overStatus].map((t) => t.id);

  const fromIndex = from.indexOf(activeId);

  const overIndexInTo = STATUSES.includes(overId as TaskStatus)
    ? to.length
    : to.indexOf(overId);

  const insertIndex = overIndexInTo < 0 ? to.length : overIndexInTo;

  const next = tasks.map((t) => ({ ...t }));

  const moving = next.find((t) => t.id === activeId);
  if (!moving) return;

  moving.status = overStatus;

  const nextFromIds =
    activeStatus === overStatus ? to : from.filter((id) => id !== activeId);

  const nextToIds =
    activeStatus === overStatus
      ? arrayMove(to, fromIndex, insertIndex)
      : (() => {
          const clone = [...to];
          clone.splice(insertIndex, 0, activeId);
          return clone;
        })();

  for (const s of STATUSES) {
    let ids: string[];

    if (activeStatus === overStatus && s === activeStatus) {
      ids = nextToIds;
    } else if (s === activeStatus) {
      ids = nextFromIds;
    } else if (s === overStatus) {
      ids = nextToIds;
    } else {
      ids = grouped[s].map((t) => t.id);
    }

    ids.forEach((id, idx) => {
      const tt = next.find((x) => x.id === id);
      if (tt) {
        tt.status = s;
        tt.order = idx;
      }
    });
  }

  const normalized = reorderLocal(next);

  try {
    await reorder(normalized);
  } catch {
    await reload();
  }
}