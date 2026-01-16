import { useState } from "react";
import { inviteMember } from "../api/members.api";
import { useAuth } from "../../auth/hooks/useAuth";

interface InviteMemberModalProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function InviteMemberModal({
  projectId,
  isOpen,
  onClose,
  onSuccess,
}: InviteMemberModalProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const {user} = useAuth();
  const handleInvite = async () => {
    if (!email.trim()) {
        setError("Email is required");
        return;
    }

    if (!user) {
        setError("You must be logged in to invite members");
        return;
    }

    setIsLoading(true);
    setError("");

    try {
        await inviteMember(projectId, {email});
        setEmail("");
        onSuccess?.();
        onClose();
    } catch (err: any) {
        setError(err.response?.data?.message || "Failed to invite member");
    } finally {
        setIsLoading(false);
    }
    };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">Invite Member</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email address"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleInvite();
          }}
        />

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="flex gap-2">
          <button
            onClick={handleInvite}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isLoading ? "Inviting..." : "Invite"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
