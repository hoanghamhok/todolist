import { useState } from "react";
import "./task.css";

type Column = {
  id: string;
  title: string;
};

type TaskFormSubmitData = {
  title: string;
  description?: string;
  columnId: string;
};

type TaskFormProps = {
  columns: Column[];
  onSubmit: (data: TaskFormSubmitData) => void | Promise<void>;
};

export function TaskForm({ columns, onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [columnId, setColumnId] = useState(
    columns[0]?.id ?? ""
  );
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !columnId) return;

    try {
      setSubmitting(true);

      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        columnId,
      });

      setTitle("");
      setDescription("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {/* Column */}
      <select
        className="input"
        value={columnId}
        onChange={(e) => setColumnId(e.target.value)}
      >
        {columns.map(col => (
          <option key={col.id} value={col.id}>
            {col.title}
          </option>
        ))}
      </select>

      {/* Title */}
      <input
        className="input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        disabled={submitting}
      />

      {/* Description */}
      <input
        className="input"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        disabled={submitting}
      />

      <button
        className="btn primary"
        type="submit"
        disabled={submitting}
      >
        {submitting ? "Adding..." : "Add task"}
      </button>
    </form>
  );
}
