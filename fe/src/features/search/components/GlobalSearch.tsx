import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../hooks/useSearch";
import type { Task } from "../../tasks/types";
import { CiFolderOn } from "react-icons/ci";
import { MdOutlineTask } from "react-icons/md";

interface GlobalSearchProps {
  onTaskClick?: (task: Task) => void;
}

export default function GlobalSearch({ onTaskClick }: GlobalSearchProps) {
  const { q, setQ, results, loading } = useSearch();
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative w-96">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => results && setShow(true)}
        placeholder="Search..."
        className="bg-gray-100 rounded-full py-2 px-4 text-sm w-full"
      />

      {show && (
        <div className="absolute top-12 w-full bg-white rounded-xl shadow-lg max-h-96 overflow-auto z-50">
          
          {loading && (
            <div className="p-3 text-sm text-slate-400">Searching...</div>
          )}

          {/* PROJECTS */}
          {results?.projects?.length > 0 && (
            <div className="p-2">
              <div className="text-xs text-slate-400 px-2 mb-1">
                Projects
              </div>
              {results.projects.map((p: any) => (
                <div
                  key={p.id}
                  onClick={() => {
                    navigate(`/projects/${p.id}`);
                    setShow(false);
                    setQ("");
                  }}
                  className="px-3 py-2 text-sm hover:bg-slate-100 rounded cursor-pointer"
                >
                  <CiFolderOn /> {p.name}
                </div>
              ))}
            </div>
          )}

          {/* TASKS */}
          {results?.tasks?.length > 0 && (
            <div className="p-2 border-t">
              <div className="text-xs text-slate-400 px-2 mb-1">
                Tasks
              </div>
              {results.tasks.map((t: any) => (
                <div
                  key={t.id}
                  onClick={() => {
                    if (onTaskClick) {
                      onTaskClick(t);
                    } else {
                      navigate(`/tasks/${t.id}`);
                    }
                    setShow(false);
                    setQ("");
                  }}
                  className="px-3 py-2 text-sm hover:bg-slate-100 rounded cursor-pointer"
                >
                  <MdOutlineTask />{t.title}
                  <div className="text-xs text-slate-400">
                    {t.project?.name}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* EMPTY */}
          {!loading &&
            results &&
            results.tasks?.length === 0 &&
            results.projects?.length === 0 && (
              <div className="p-4 text-sm text-center text-slate-400">
                No results
              </div>
            )}
        </div>
      )}
    </div>
  );
}