import type { Task, TaskStatus } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
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

function EditIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path
        d="M12 20h9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5z"
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
  onEdit,
}: {
  task: Task;
  onDelete: (id: string) => void;
  onChangeStatus: (id: string, status: TaskStatus) => void;
  onEdit: (id: string, data: Partial<Pick<Task, "title" | "description">>) => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [saving, setSaving] = useState(false);

  // Synchronizer when tasks changed from outside
  useMemo(() => {
    if (!isEditing) {
      setTitle(task.title);
      setDescription(task.description ?? "");
    }
  }, [task.title, task.description, isEditing]);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: "TASK", task },
    disabled: isEditing || saving, //Cant drag when editting
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.65 : 1,
  };

  const startEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const cancelEdit = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsEditing(false);
    setTitle(task.title);
    setDescription(task.description ?? "");
  };

  const saveEdit = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextTitle = title.trim();
    const nextDesc = description.trim();

    if (!nextTitle) return;

    setSaving(true);
    try {
      await onEdit(task.id, { title: nextTitle, description: nextDesc || undefined });
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`card ${isDragging ? "cardDragging" : ""}`}
      {...attributes}
      {...(!isEditing ? listeners : {})}
    >
      <div className="cardTop">
        <div className="cardTitleWrap">
          {!isEditing ? (
            <>
              <strong className="cardTitle">{task.title}</strong>
              {task.description && <p className="cardDesc">{task.description}</p>}
            </>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}
              onPointerDown={(e) => e.stopPropagation()} // Cant drag when input focusing
            >
              <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
              <input
                className="input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn primary" type="button" onClick={saveEdit} disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
                <button className="btn" type="button" onClick={cancelEdit} disabled={saving}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* actions */}
        {!isEditing && (
          <div style={{ display: "flex", gap: 8 }} onPointerDown={(e) => e.stopPropagation()}>
            <button className="iconBtn" title="Edit" onClick={startEdit}>
              <EditIcon />
            </button>

            <button
              className="iconBtn danger"
              title="Delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
            >
              <TrashIcon />
            </button>
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="cardActions" onPointerDown={(e) => e.stopPropagation()}>
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
      )}
    </div>
  );
}
