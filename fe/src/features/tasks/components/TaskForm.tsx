import { useState } from "react";
import "./task.css";

export function TaskForm({ onSubmit }: { onSubmit: (title: string, description?: string) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title.trim(), description.trim() || undefined);
    setTitle("");
    setDescription("");
  };

  return (
    <form onSubmit={submit} className="form">
      <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <input
        className="input"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <button className="btn primary" type="submit">
        Add
      </button>
    </form>
  );
}
