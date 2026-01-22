import type { Task } from "../types";
import { useDraggable } from "@dnd-kit/core";

interface TaskCardProps {
  task: Task;
  assignees?: Array<{ id: string; userId: string; user?: { name?: string; email?: string; username?: string }; name?: string; avatar?: string }>;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskCard({ task, assignees = [], onEdit, onDelete }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
  });

  // Get assignee for tasks
  const taskAssignees = assignees.filter(a => task.assigneeIds.includes(a.userId));

  const getInitials = (member: any) => {
    const email = member.user?.email || member.email || "";
    if (!email) return "?";
    if (email.includes("@")) {
      return email.split("@")[0][0]?.toUpperCase() || "?";
    }
    return email[0]?.toUpperCase() || "?";
  };

  const getAvatarColor = (index: number) => {
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-cyan-500",
    ];
    return colors[index % colors.length];
  };

  const getMemberName = (member: any) => {
    return member.user?.name || member.name || member.user?.username || "Unknown";
  };

  return (
    <div 
      ref={setNodeRef}
      className={`bg-white p-2.5 rounded-2xl shadow-sm hover:shadow transition flex flex-col justify-between group relative cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-50 ring-2 ring-blue-500" : ""
      }`}
    >
      <div
        {...attributes}
        {...listeners}
      >
        <div className="font-medium text-sm flex-1 mb-2">
          {task.title}
        </div>
        {task.description && (
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{task.description}</p>
        )}
      </div>

      <div className="flex justify-between items-end">
        <div className="opacity-0 group-hover:opacity-100 transition flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="px-2 py-1 text-xs bg-blue-500 text-white rounded-2xl hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="px-2 py-1 text-xs bg-red-500 text-white rounded-2xl hover:bg-red-600"
          >
            Delete
          </button>
        </div>

        {/*assignees'task avatars*/}
        {taskAssignees.length > 0 && (
          <div className="flex -space-x-2">
            {taskAssignees.map((assignee, index) => (
              <div
                key={assignee.userId}
                className={`w-6 h-6 ${getAvatarColor(index)} rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white cursor-pointer hover:scale-110 transition-transform relative group/avatar`}
              >
                {getInitials(assignee)}
                <div className="hidden group-hover/avatar:block absolute bottom-full right-0 mb-2 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-20">
                  {getMemberName(assignee)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
