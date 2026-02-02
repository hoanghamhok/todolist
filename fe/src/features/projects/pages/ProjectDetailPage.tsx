import { useParams } from "react-router-dom";
import { useColumn } from "../../columns/hooks/useColumn";
import { useTask } from "../../tasks/hooks/useTasks";
import { useProjectDetails } from "../hooks/useProjectDetails";
import { useProjectMembers } from "../hooks/useProjectMembers";
import { useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { useProjectRole } from "../hooks/useProjectRole";
import { MembersAvatar } from "../components/MembersAvatar";
import { InviteMemberModal } from "../components/InviteMemberModal";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";
import { DragContextProvider } from "../components/DragContextProvider";
import { ColumnCard } from "../components/ColumnCard";
import { useDnd } from "../../tasks/hooks/useDnd";
import { LeaveProject } from "../components/LeaveProject";


export default function ProjectDetailPage() {
  const [isAdding,setIsAdding] = useState(false);
  const [columnTitle,setColumnTitle] = useState("");
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
  const {move} = useTask(projectId)
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
  
  // Check role current user
  const members = membersRes?.data ?? [];

  const { isAdmin } = useProjectRole(members, user?.id);

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

  const handleDragEnd = useDnd({  
    columns,
    byColumn,
    move,
  });
  

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
      
      {/*Header*/}
      <header className="px-6 py-4 bg-white border-b flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold truncate">{project.name}</h1>
          <p className="text-gray-500 text-sm truncate">{project.description}</p>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <MembersAvatar 
            projectId={projectId}
            isAdmin={isAdmin}
            onInviteClick={() => setIsInviteModalOpen(true)}
          />
          <LeaveProject projectId={projectId} />
        </div>
      </header>

      {/*Error*/}
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

      {/* Board*/}
      <main className="flex-1">
        <div className="flex gap-4 p-6 overflow-x-auto snap-x snap-mandatory">
          {columns.map(column => (
            <div key={column.id} className="w-64 sm:w-72 shrink-0 snap-start">
              <ColumnCard
                column={column}
                tasks={byColumn[column.id] ?? []}
                members={members}
                isAdmin={isAdmin}
                projectId={projectId}
                markColumnAsDone={markColumnAsDone}
                editColumn={editColumn}
                deleteColumn={(id, name) => {
                  setDeleteTarget({ type: "column", id, name });
                  setDeleteConfirmOpen(true);
                }}
                addTask={async (columnId, title, projId, description, assigneeIds, dueDate) => {
                  await addTask(columnId, title, projId, description, assigneeIds, dueDate);
                }}
                editTask={editTask}
                deleteTask={(id, title) => {
                  setDeleteTarget({ type: "task", id, name: title });
                  setDeleteConfirmOpen(true);
                }}
              />
            </div>
          ))}
          {/* Add column */}
          <div className="w-64 sm:w-72 shrink-0 snap-start">
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
