import { useEffect, useState } from "react";
import type { Column } from "../type";
import { fetchColumnsByProject } from "../columns.api";

export function useColumn(projectId: string) {
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchColumnsByProject(projectId);
      setColumns(res.data);
    } catch (e: any) {
      setError(e?.message ?? "Load columns failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [projectId]);

  return {
    columns: [...columns].sort((a, b) => a.position - b.position),
    loading,
    error,
    reload: load,
  };
}
