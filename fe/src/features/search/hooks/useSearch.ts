import { useEffect, useState } from "react";
import { searchAPI } from "../api/search.api";

export const useSearch = () => {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q.trim()) {
      setResults(null);
      return;
    }

    const t = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await searchAPI.search(q);
        setResults(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [q]);

  return {
    q,
    setQ,
    results,
    loading,
  };
};