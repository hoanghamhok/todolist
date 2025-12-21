import { useState } from "react";

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
    <form onSubmit={submit} style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="title" />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="description"
      />
      <button type="submit">Add</button>
    </form>
  );
}
