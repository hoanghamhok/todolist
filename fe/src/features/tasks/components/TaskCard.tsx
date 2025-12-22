import type { Task, TaskStatus } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./task.css";

function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path
        d="M9 3h6m-7 4h8m-9 0 1 15a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-15M10 10v9m4-9v9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TaskCard({
  task,
  onDelete,
  onChangeStatus,
}: {
  task: Task;
  onDelete: (id: string) => void;
  onChangeStatus: (id: string, status: TaskStatus) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: "TASK", task },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.65 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`card ${isDragging ? "cardDragging" : ""}`}
      {...attributes}
      {...listeners} // ✅ drag toàn card
    >
      <div className="cardTop">
        <div className="cardTitleWrap">
          <strong className="cardTitle">{task.title}</strong>
          {task.description && <p className="cardDesc">{task.description}</p>}
        </div>

        {/* ✅ icon delete */}
        <button
          className="iconBtn danger"
          title="Delete"
          onClick={(e) => {
            e.stopPropagation(); // tránh click delete làm ảnh hưởng drag/click card
            onDelete(task.id);
          }}
        >
          <TrashIcon />
        </button>
      </div>

      {/* ✅ cụm status nằm giữa đẹp */}
      <div
        className="cardActions"
        onPointerDown={(e) => e.stopPropagation()} // tránh kéo nhầm khi bấm pill
      >
        <button className="pill" disabled={task.status === "TODO"} onClick={() => onChangeStatus(task.id, "TODO")}>
          TO DO
        </button>
        <button
          className="pill"
          disabled={task.status === "INPROGRESS"}
          onClick={() => onChangeStatus(task.id, "INPROGRESS")}
        >
          IN PROGRESS
        </button>
        <button className="pill" disabled={task.status === "DONE"} onClick={() => onChangeStatus(task.id, "DONE")}>
          DONE
        </button>
      </div>
    </div>
  );
}
