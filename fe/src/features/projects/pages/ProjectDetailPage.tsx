import { useParams } from "react-router-dom";
import { useColumn } from "../../columns/hooks/useColumn";
import { useTask } from "../../tasks/hooks/useTasks";
import { useProjectDetails } from "../hooks/useProjectDetails";
import { useProjectMembers } from "../hooks/useProjectMembers";
import { useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { MembersAvatar } from "../components/MembersAvatar";
import { InviteMemberModal } from "../components/InviteMemberModal";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";

export default function ProjectDetailPage() {
  const [isAdding,setIsAdding] = useState(false);
  const [columnTitle,setColumnTitle] = useState("");
  const [addingColumnId, setAddingColumnId] = useState<string | null>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [editingColumnTitle, setEditingColumnTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState("");
  const [editingTaskDescription, setEditingTaskDescription] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "column" | "task"; id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { projectId } = useParams<{ projectId: string }>();
  const {user} = useAuth();

  if (!projectId) {
    return <div className="p-6">Invalid project</div>;
  }

  const {
    data: projectRes,
    isLoading: projectLoading,
    isError: projectError,
  } = useProjectDetails(projectId);

  const { data: membersRes, refetch: refetchMembers } = useProjectMembers(projectId);

  const { columns, loading: columnLoading,add:addColumn, edit: editColumn, remove: deleteColumn } = useColumn(projectId);
  const { byColumn, loading: taskLoading,add:addTask, edit: editTask, remove: deleteTask } = useTask(projectId);

  if (projectLoading || columnLoading || taskLoading) {
    return <div className="p-6">Loading project...</div>;
  }

  if (projectError || !projectRes) {
    return <div className="p-6 text-red-500">Project not found</div>;
  }

  const project = projectRes.data;
  
  // Check if current user is admin/owner
  const members = Array.isArray(membersRes) ? membersRes : membersRes?.data || [];
  const currentUserMember = members.find((m: any) => m.userId === user?.id);
  const isAdmin = currentUserMember?.role === "ADMIN" || currentUserMember?.role === "OWNER";

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    
    setIsDeleting(true);
    try {
      if (deleteTarget.type === "column") {
        await deleteColumn(deleteTarget.id);
      } else if (deleteTarget.type === "task") {
        await deleteTask(deleteTarget.id);
      }
      setDeleteConfirmOpen(false);
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <ConfirmDeleteModal
        isOpen={deleteConfirmOpen}
        title={deleteTarget?.type === "column" ? "Delete Column" : "Delete Task"}
        message={
          deleteTarget?.type === "column"
            ? `Are you sure you want to delete the column "${deleteTarget?.name}" and all its tasks?`
            : `Are you sure you want to delete the task "${deleteTarget?.name}"?`
        }
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setDeleteTarget(null);
        }}
      />

      <InviteMemberModal 
        projectId={projectId}
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSuccess={() => refetchMembers()}
      />
      
      {/* ===== Header ===== */}
      <header className="px-6 py-4 bg-white border-b flex justify-between items-start">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{project.name}</h1>
          <p className="text-gray-500 text-sm">{project.description}</p>
        </div>
        <MembersAvatar 
          projectId={projectId}
          isAdmin={isAdmin}
          onInviteClick={() => setIsInviteModalOpen(true)}
        />
      </header>

      {/* ===== Board ===== */}
      <main className="flex-1 overflow-x-auto">
        <div className="flex gap-4 p-6">
          {columns.map(column => (
            <div
              key={column.id}
              className="w-72 shrink-0 bg-gray-100 rounded-lg p-3"
            >
              {editingColumnId === column.id ? (
                <div className="space-y-2 mb-3">
                  <input
                    autoFocus
                    value={editingColumnTitle}
                    onChange={e => setEditingColumnTitle(e.target.value)}
                    placeholder="Column title"
                    className="w-full px-2 py-1 rounded border focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        editColumn(column.id, editingColumnTitle.trim());
                        setEditingColumnId(null);
                        setEditingColumnTitle("");
                      }
                      if (e.key === "Escape") {
                        setEditingColumnId(null);
                        setEditingColumnTitle("");
                      }
                    }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        editColumn(column.id, editingColumnTitle.trim());
                        setEditingColumnId(null);
                        setEditingColumnTitle("");
                      }}
                      className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingColumnId(null);
                        setEditingColumnTitle("");
                      }}
                      className="px-2 py-1 text-gray-500 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center mb-3 group">
                  <h3 className="font-medium">{column.title}</h3>
                  <div className="opacity-0 group-hover:opacity-100 transition flex gap-1">
                    <button
                      onClick={() => {
                        setEditingColumnId(column.id);
                        setEditingColumnTitle(column.title);
                      }}
                      className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setDeleteTarget({ type: "column", id: column.id, name: column.title });
                        setDeleteConfirmOpen(true);
                      }}
                      className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}

              {/* Tasks */}
              <div className="space-y-2 mb-2">
                {(byColumn[column.id] ?? []).map(task => (
                  editingTaskId === task.id ? (
                    <div
                      key={task.id}
                      className="bg-white p-2 rounded shadow-sm space-y-2"
                    >
                      <input
                        autoFocus
                        value={editingTaskTitle}
                        onChange={e => setEditingTaskTitle(e.target.value)}
                        placeholder="Task title"
                        className="w-full px-2 py-1 rounded border text-sm"
                        onKeyDown={e => {
                          if (e.key === "Enter") {
                            editTask(task.id, {
                              title: editingTaskTitle.trim(),
                              description: editingTaskDescription
                            });
                            setEditingTaskId(null);
                            setEditingTaskTitle("");
                            setEditingTaskDescription("");
                          }
                          if (e.key === "Escape") {
                            setEditingTaskId(null);
                            setEditingTaskTitle("");
                            setEditingTaskDescription("");
                          }
                        }}
                      />
                      <textarea
                        value={editingTaskDescription}
                        onChange={e => setEditingTaskDescription(e.target.value)}
                        placeholder="Description"
                        className="w-full px-2 py-1 rounded border text-sm"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            editTask(task.id, {
                              title: editingTaskTitle.trim(),
                              description: editingTaskDescription
                            });
                            setEditingTaskId(null);
                            setEditingTaskTitle("");
                            setEditingTaskDescription("");
                          }}
                          className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingTaskId(null);
                            setEditingTaskTitle("");
                            setEditingTaskDescription("");
                          }}
                          className="px-3 py-1 text-gray-500 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={task.id}
                      className="bg-white p-3 rounded shadow-sm
                                hover:shadow transition flex justify-between items-start group"
                    >
                      <div className="font-medium text-sm flex-1">
                        {task.title}
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition flex gap-1">
                        <button
                          onClick={() => {
                            setEditingTaskId(task.id);
                            setEditingTaskTitle(task.title);
                            setEditingTaskDescription(task.description || "");
                          }}
                          className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setDeleteTarget({ type: "task", id: task.id, name: task.title });
                            setDeleteConfirmOpen(true);
                          }}
                          className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                ))}
              </div>

              {/* Add task */}
              {addingColumnId === column.id ? (
                <div className="bg-white p-2 rounded space-y-2">
                  <input
                    autoFocus
                    value={taskTitle}
                    onChange={e => setTaskTitle(e.target.value)}
                    placeholder="Task title"
                    className="w-full px-2 py-1 rounded border"
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        if (!taskTitle.trim() || !user) return;
                        addTask(
                          column.id,
                          taskTitle.trim(),
                          user.id,
                          projectId,
                          taskDescription
                        );
                        setTaskTitle("");
                        setTaskDescription("");
                        setAddingColumnId(null);
                      }
                      if (e.key === "Escape") {
                        setAddingColumnId(null);
                        setTaskTitle("");
                        setTaskDescription("");
                      }
                    }}
                  />

                  <textarea
                    value={taskDescription}
                    onChange={e => setTaskDescription(e.target.value)}
                    placeholder="Description (optional)"
                    className="w-full px-2 py-1 rounded border text-sm"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (!taskTitle.trim() || !user) return;
                        addTask(
                          column.id,
                          taskTitle.trim(),
                          user.id,
                          projectId,
                          taskDescription
                        );
                        setTaskTitle("");
                        setTaskDescription("");
                        setAddingColumnId(null);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                    >
                      Add
                    </button>

                    <button
                      onClick={() => {
                        setAddingColumnId(null);
                        setTaskTitle("");
                        setTaskDescription("");
                      }}
                      className="px-3 py-1 text-gray-500 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAddingColumnId(column.id)}
                  className="w-full text-left text-sm text-gray-500
                            hover:text-gray-700 mt-2"
                >
                  + Add task
                </button>
              )}
            </div>
          ))}

          {/* Add column */}
          <div className="w-72 shrink-0">
            {isAdding ? (
              <div className="bg-gray-100 p-3 rounded-lg space-y-2">
                <input
                  autoFocus
                  value={columnTitle}
                  onChange={(e) => setColumnTitle(e.target.value)}
                  placeholder="Column title"
                  className="w-full px-2 py-1 rounded border
                            focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (!columnTitle.trim()) return;
                      addColumn(columnTitle.trim());
                      setColumnTitle("");
                      setIsAdding(false);
                    }
                    if (e.key === "Escape") {
                      setIsAdding(false);
                      setColumnTitle("");
                    }
                  }}
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (!columnTitle.trim()) return;
                      addColumn(columnTitle.trim());
                      setColumnTitle("");
                      setIsAdding(false);
                    }}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Add
                  </button>

                  <button
                    onClick={() => {
                      setIsAdding(false);
                      setColumnTitle("");
                    }}
                    className="px-3 py-1 text-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAdding(true)}
                className="w-full h-12 border-2 border-dashed rounded-lg
                          text-gray-500 hover:bg-gray-100"
              >
                + Add column
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
