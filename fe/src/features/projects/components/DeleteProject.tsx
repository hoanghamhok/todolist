import { useRemoveProject } from "../hooks/useProjectDelete";
import { Trash2Icon } from "lucide-react";
import { useConfirm } from "../../shared/components/ConfirmContext";

interface RemoveProjectProps {
  projectId: string;
}

export function RemoveProject({ projectId }: RemoveProjectProps) {
  const { mutate } = useRemoveProject(projectId);
  const { openConfirm } = useConfirm();

  return (
    <div className="pt-3">
      <button
        onClick={() =>
          openConfirm({
            title: "Delete Project",
            message:
              "This action will delete all project data including columns, tasks, comments, attachments, activity logs, and all associated data. This action cannot be undone.",
            onConfirm: () => {
              mutate(projectId);
              window.location.href = "/";
            },
          })
        }
        className="w-9 h-9 rounded-full bg-red-500 hover:bg-red-800 text-white flex items-center justify-center text-sm font-bold transition self-center"
        title="Delete Project"
      >
        <Trash2Icon className="w-5" />
      </button>
    </div>
  );
}