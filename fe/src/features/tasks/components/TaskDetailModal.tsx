import { useEffect } from "react";
import dayjs from "dayjs";
import type { Task } from "../types";
import { CommentSection } from "../../comment/components/CommentSection";

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
}

export function TaskDetailModal({ task, onClose }: TaskDetailModalProps) {
  // ESC close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Map status colors
  const getStatusStyle = (columnId: string) => {
    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
      'todo': { bg: 'bg-slate-500/10', text: 'text-slate-600', label: 'To Do' },
      'in-progress': { bg: 'bg-indigo-500/10', text: 'text-indigo-600', label: 'In Progress' },
      'done': { bg: 'bg-emerald-500/10', text: 'text-emerald-600', label: 'Done' },
    };
    return statusMap[columnId] || { bg: 'bg-gray-500/10', text: 'text-gray-600', label: columnId };
  };

  const statusStyle = getStatusStyle(task.columnId);
  console.log(task)
  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white/85 backdrop-blur-2xl w-full max-w-6xl h-full max-h-[90vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/40"
      >
        {/* Close Button (Mobile Floating) */}
        <button
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 z-50 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
        >
          <span className="text-xl">✕</span>
        </button>

        {/* Main Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10">
          {/* Header Actions & Title */}
          <div className="space-y-6">
            <nav className="flex items-center gap-2 text-xs font-semibold tracking-widest text-gray-500 uppercase">
              <span>Projects</span>
              <span>›</span>
              <span className="text-indigo-600">Task-{task.id}</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
                {task.title}
              </h1>

              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gray-900 font-semibold shadow-sm hover:shadow-md transition-all border border-slate-100">
                  <span className="text-xl">✏️</span>
                  <span>Edit</span>
                </button>
                <button
                  onClick={onClose}
                  className="hidden md:flex w-11 h-11 items-center justify-center rounded-xl bg-white text-gray-900 shadow-sm hover:shadow-md transition-all border border-slate-100"
                >
                  <span className="text-xl">✕</span>
                </button>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-600">
              <span className="text-2xl">📝</span>
              <h3 className="text-lg font-bold">Description</h3>
            </div>

            <div className="text-gray-600 leading-relaxed text-lg max-w-3xl">
              {task.description ? (
                <p className="whitespace-pre-line">{task.description}</p>
              ) : (
                <p className="text-gray-400 italic">No description provided</p>
              )}
            </div>
          </div>

          {/* Difficulty & Estimate */}
          {(task.difficulty || task.estimateHours) && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-600">
                <span className="text-2xl">📊</span>
                <h3 className="text-lg font-bold">Task Metrics</h3>
              </div>

              <div className="flex gap-4 flex-wrap">
                {task.difficulty && (
                  <div className="px-4 py-2 bg-amber-50 rounded-xl border border-amber-200">
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
                      Difficulty
                    </p>
                    <p className="text-sm font-semibold text-amber-900">
                      {task.difficulty}
                    </p>
                  </div>
                )}

                {task.estimateHours && (
                  <div className="px-4 py-2 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                      Estimate
                    </p>
                    <p className="text-sm font-semibold text-blue-900">
                      {task.estimateHours}h
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Activity Log / Comments */}
          <div className="space-y-6 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-2 text-indigo-600">
              <span className="text-2xl">💬</span>
              <h3 className="text-lg font-bold">Activity</h3>
            </div>

            <CommentSection taskId={task.id} />
          </div>
        </div>

        {/* Sidebar Metadata */}
        <aside className="w-full md:w-80 bg-slate-50/80 p-8 md:p-12 space-y-10 border-l border-white/50">
          {/* Status & Priority */}
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                Status
              </p>
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 ${statusStyle.bg} ${statusStyle.text} rounded-full`}
              >
                <div className={`w-2 h-2 rounded-full ${statusStyle.text.replace('text-', 'bg-')} animate-pulse`}></div>
                <span className="text-sm font-bold">{statusStyle.label}</span>
              </div>
            </div>

            {task.difficulty && (
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                  Difficulty
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 text-amber-700 rounded-full">
                  <span className="text-base">⚡</span>
                  <span className="text-sm font-bold">{task.difficulty}</span>
                </div>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <div>
                <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-gray-500">
                  STATUS
                </p>
                <p className="text-sm font-semibold text-gray-900">{}</p>
              </div>
            </div>

            {task.dueDate && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-500 shadow-sm">
                  <span className="text-xl">📅</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                    Due Date
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {dayjs(task.dueDate).format("MMM DD, YYYY")}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {dayjs(task.dueDate).format("HH:mm")}
                  </p>
                </div>
              </div>
            )}

            {task.estimateHours && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-500 shadow-sm">
                  <span className="text-xl">⏱️</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                    Estimate
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {task.estimateHours} hours
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Sidebar Action */}
          <div className="pt-6 border-t border-slate-200/50">
            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white text-red-600 font-bold text-sm shadow-sm hover:bg-red-50 transition-colors">
              <span className="text-lg">🗑️</span>
              <span>Delete Task</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}