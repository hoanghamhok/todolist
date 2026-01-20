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
import { DragContextProvider } from "../components/DragContextProvider";
import { ColumnTasksContainer } from "../components/ColumnTasksContainer";
import api from "../../../api/client";
import type { DragEndEvent } from "@dnd-kit/core";

export default function ProjectDetailPage() {
  const [isAdding,setIsAdding] = useState(false);
  const [columnTitle,setColumnTitle] = useState("");
  const [addingColumnId, setAddingColumnId] = useState<string | null>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskAssignees, setTaskAssignees] = useState<string[]>([]);
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [editingColumnTitle, setEditingColumnTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState("");
  const [editingTaskDescription, setEditingTaskDescription] = useState("");
  const [editingTaskAssignees, setEditingTaskAssignees] = useState<string[]>([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "column" | "task"; id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

  const { columns, loading: columnLoading,add:addColumn, edit: editColumn, remove: deleteColumn, markAsDone: markColumnAsDone } = useColumn(projectId);
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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = String(active.id);
    const overId = String(over.id);
    
    if (taskId === overId) return; // No change

    // Find which column task is coming from and going to
    let sourceColumnId = "";
    let targetColumnId = "";

    // Find source column
    for (const [colId, tasks] of Object.entries(byColumn)) {
      if ((tasks as any[]).some(t => t.id === taskId)) {
        sourceColumnId = colId;
        break;
      }
    }

    // Find target column
    // If overId is a column ID, use it directly, otherwise find the column containing the task
    const isOverAColumn = columns.some(col => col.id === overId);
    if (isOverAColumn) {
      targetColumnId = overId;
    } else {
      // overId is another task
      for (const [colId, tasks] of Object.entries(byColumn)) {
        if ((tasks as any[]).some(t => t.id === overId)) {
          targetColumnId = colId;
          break;
        }
      }
    }

    if (!sourceColumnId || !targetColumnId) return;

    try {
      // Get all tasks in target column for position calculation
      const targetTasks = byColumn[targetColumnId] as any[] || [];
      const sourceTask = (byColumn[sourceColumnId] as any[] || []).find(t => t.id === taskId);

      if (!sourceTask) return;

      let beforeTaskId: string | undefined;
      let afterTaskId: string | undefined;

      // If dropping on a specific task, calculate before/after
      if (!isOverAColumn && overId !== taskId) {
        const overTaskIndex = targetTasks.findIndex(t => t.id === overId);
        if (overTaskIndex >= 0) {
          afterTaskId = overId; // Drop before the over task
        }
      }

      const payload = {
        columnId: targetColumnId,
        beforeTaskId,
        afterTaskId,
      };

      const response = await api.patch(`/tasks/${taskId}/move`, payload);

      if (response.status === 200) {
        setTimeout(() => window.location.reload(), 300);
      }
    } catch (error) {
      console.error("Failed to move task:", error);
    }
  };
  

  return (
    <DragContextProvider onDragEnd={handleDragEnd}>
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

      {/* Error Message */}
      {errorMessage && (
        <div className="px-6 py-3 bg-red-50 border-b border-red-200 flex justify-between items-center">
          <span className="text-red-700 text-sm">{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-500 hover:text-red-700 text-lg"
          >
            ✕
          </button>
        </div>
      )}

      {/* ===== Board ===== */}
      <main className="flex-1 overflow-x-auto">
        <div className="flex gap-4 p-6 ">
          {columns.map(column => (
            <div
              key={column.id}
              className="w-72 shrink-0 bg-gray-100 rounded-2xl p-3"
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
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{column.title}</h3>
                    {column.closed && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                        DONE
                      </span>
                    )}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition flex gap-1">
                    {!column.closed && (
                      <button
                        onClick={async () => {
                          try {
                            setErrorMessage(null);
                            await markColumnAsDone(column.id);
                          } catch (error: any) {
                            const message = error?.response?.data?.message || "Failed to mark column as done";
                            setErrorMessage(message);
                            setTimeout(() => setErrorMessage(null), 5000);
                          }
                        }}
                        className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                        title="Mark column as done"
                      >
                        ✓ Done
                      </button>
                    )}
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
              <ColumnTasksContainer
                columnId={column.id}
                tasks={byColumn[column.id] ?? []}
                editingTaskId={editingTaskId}
                assignees={members as any}
                renderEditForm={(task) => (
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
                        if (e.key === "Escape") {
                          setEditingTaskId(null);
                          setEditingTaskTitle("");
                          setEditingTaskDescription("");
                          setEditingTaskAssignees([]);
                        }
                      }}
                    />
                    <textarea
                      value={editingTaskDescription}
                      onChange={e => setEditingTaskDescription(e.target.value)}
                      placeholder="Description"
                      className="w-full px-2 py-1 rounded border text-sm"
                    />
                    
                    {/* Edit Assignees - Only Admin/Owner */}
                    {isAdmin && (
                      <div className="space-y-1 border-t pt-2">
                        <label className="text-xs font-medium text-gray-600">Assign to:</label>
                        <div className="flex flex-wrap gap-2">
                          {(members || []).map((member: any) => (
                            <button
                              key={member.id}
                              onClick={() => {
                                setEditingTaskAssignees(prev =>
                                  prev.includes(member.userId)
                                    ? prev.filter(id => id !== member.userId)
                                    : [...prev, member.userId]
                                );
                              }}
                              className={`px-2 py-1 text-xs rounded transition ${
                                editingTaskAssignees.includes(member.userId)
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {member.user?.name || 'Unknown'}
                            </button>
                          ))}
                        </div>
                        {editingTaskAssignees.length === 0 && (
                          <p className="text-xs text-red-500">Select at least one assignee</p>
                        )}
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          editTask(task.id, {
                            title: editingTaskTitle.trim(),
                            description: editingTaskDescription,
                            ...(isAdmin && { assigneeIds: editingTaskAssignees })
                          });
                          setEditingTaskId(null);
                          setEditingTaskTitle("");
                          setEditingTaskDescription("");
                          setEditingTaskAssignees([]);
                        }}
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm disabled:bg-gray-400"
                        disabled={isAdmin && editingTaskAssignees.length === 0}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingTaskId(null);
                          setEditingTaskTitle("");
                          setEditingTaskDescription("");
                          setEditingTaskAssignees([]);
                        }}
                        className="px-3 py-1 text-gray-500 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                onEditTask={(taskId) => {
                  const task = (byColumn[column.id] ?? []).find(t => t.id === taskId);
                  if (task) {
                    setEditingTaskId(task.id);
                    setEditingTaskTitle(task.title);
                    setEditingTaskDescription(task.description || "");
                    setEditingTaskAssignees(task.assigneeIds);
                  }
                }}
                onDeleteTask={(taskId, taskTitle) => {
                  setDeleteTarget({ type: "task", id: taskId, name: taskTitle });
                  setDeleteConfirmOpen(true);
                }}
              />

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
                        if (!taskTitle.trim() || !user || taskAssignees.length === 0) return;
                        addTask(
                          column.id,
                          taskTitle.trim(),
                          projectId,
                          taskDescription,
                          taskAssignees,
                        );
                        setTaskTitle("");
                        setTaskDescription("");
                        setTaskAssignees([]);
                        setAddingColumnId(null);
                      }
                      if (e.key === "Escape") {
                        setAddingColumnId(null);
                        setTaskTitle("");
                        setTaskDescription("");
                        setTaskAssignees([]);
                      }
                    }}
                  />

                  <textarea
                    value={taskDescription}
                    onChange={e => setTaskDescription(e.target.value)}
                    placeholder="Description (optional)"
                    className="w-full px-2 py-1 rounded border text-sm"
                  />

                  {/* Due Date */}
                  <div>
                    <label className="text-xs font-medium text-gray-600">Due Date (optional):</label>
                    <input
                      type="datetime-local"
                      value={taskDueDate}
                      onChange={e => setTaskDueDate(e.target.value)}
                      className="w-full px-2 py-1 rounded border text-sm"
                    />
                  </div>

                  {/* Assignees Selection */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Assign to:</label>
                    <div className="flex flex-wrap gap-2">
                      {(members || []).map((member: any) => (
                        <button
                          key={member.id}
                          onClick={() => {
                            setTaskAssignees(prev =>
                              prev.includes(member.userId)
                                ? prev.filter(id => id !== member.userId)
                                : [...prev, member.userId]
                            );
                          }}
                          className={`px-2 py-1 text-xs rounded transition ${
                            taskAssignees.includes(member.userId)
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {member.user?.name || 'Unknown'}
                        </button>
                      ))}
                    </div>
                    {taskAssignees.length === 0 && (
                      <p className="text-xs text-red-500">Select at least one assignee</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (!taskTitle.trim() || !user || taskAssignees.length === 0) return;
                        addTask(
                          column.id,
                          taskTitle.trim(),
                          projectId,
                          taskDescription,
                          taskAssignees,
                          taskDueDate ? new Date(taskDueDate).toISOString() : undefined,
                        );
                        setTaskTitle("");
                        setTaskDescription("");
                        setTaskDueDate("");
                        setTaskAssignees([]);
                        setAddingColumnId(null);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm disabled:bg-gray-400"
                      disabled={!taskTitle.trim() || taskAssignees.length === 0}
                    >
                      Add
                    </button>

                    <button
                      onClick={() => {
                        setAddingColumnId(null);
                        setTaskTitle("");
                        setTaskDescription("");
                        setTaskDueDate("");
                        setTaskAssignees([]);
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
    </DragContextProvider>
  );
}
