import { useState } from "react";
import { TrashIcon } from "lucide-react";
import { ConfirmDeleteModal } from "../../projects/components/ConfirmDeleteModal";
import { useNotifications } from "../hooks/useNotifications";

interface DeleteNotificationProps {
  notiId: string;
}

export function DeleteNotification({ notiId }: DeleteNotificationProps) {
  const [open, setOpen] = useState(false);
  const { deleteNotification } = useNotifications();

  const handleConfirm = () => {
    deleteNotification.mutate(notiId);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="w-7 h-7 rounded-full bg-red-500 hover:bg-red-700
                   text-white flex items-center justify-center"
        title="Delete notification"
      >
        <TrashIcon className="w-4 h-4" />
      </button>

      <ConfirmDeleteModal
        isOpen={open}
        title="Delete notification"
        message="Are you sure you want to delete this notification?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
