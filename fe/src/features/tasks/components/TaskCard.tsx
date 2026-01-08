import type { Task } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import "./task.css";
import { TrashIcon,EditIcon } from "lucide-react";

/* Icons giữ nguyên */

export function TaskCard({
  task,
  onDelete,
  onEdit,
}: {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (
    id: string,
    data: Partial<Pick<Task, "title" | "description">>
  ) => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [saving, setSaving] = useState(false);

  // sync external changes
  useMemo(() => {
    if (!isEditing) {
      setTitle(task.title);
      setDescription(task.description ?? "");
    }
  }, [task.title, task.description, isEditing]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "TASK",
      taskId: task.id,
      columnId: task.columnId, // 🔥 quan trọng cho DnD
    },
    disabled: isEditing || saving,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const startEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setTitle(task.title);
    setDescription(task.description ?? "");
  };

  const saveEdit = async () => {
    const nextTitle = title.trim();
    const nextDesc = description.trim();
    if (!nextTitle) return;

    setSaving(true);
    try {
      await onEdit(task.id, {
        title: nextTitle,
        description: nextDesc || undefined,
      });
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
              {task.description && (
                <p className="cardDesc">{task.description}</p>
              )}
            </>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                width: "100%",
              }}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <input
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
              />
              <input
                className="input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn primary"
                  onClick={saveEdit}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  className="btn"
                  onClick={cancelEdit}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {!isEditing && (
          <div
            style={{ display: "flex", gap: 8 }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button className="iconBtn" title="Edit" onClick={startEdit}>
              <EditIcon />
            </button>
            <button
              className="iconBtn danger"
              title="Delete"
              onClick={() => onDelete(task.id)}
            >
              <TrashIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
