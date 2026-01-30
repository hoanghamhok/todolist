import { useProjectMembers } from "../hooks/useProjectMembers";
import { useState} from "react";

interface MembersAvatarProps {
  projectId: string;
  isAdmin: boolean;
  onInviteClick: () => void;
}

export function MembersAvatar({
  projectId,
  isAdmin,
  onInviteClick,
}: MembersAvatarProps) {
  const { data: membersRes, isLoading } = useProjectMembers(projectId);
  const members = Array.isArray(membersRes) ? membersRes : membersRes?.data || [];

  const displayMembers = members.slice(0);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showMenuFor, setShowMenuFor] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<"ADMIN" | "KICK" | null>(null);

  const getInitials = (identifier: string) => {
    if (!identifier) return "?";
    if (identifier.includes("@")) {
      return identifier.split("@")[0][0]?.toUpperCase() || "?";
    }
    return identifier[0]?.toUpperCase() || "?";
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

  if (isLoading) {
    return <div className="text-xs text-gray-500">Loading...</div>;
  }

  return (
    <div className="flex items-center gap-2 pt-3">
      <div className="flex -space-x-2">
        {displayMembers.map((member: any, index: number) => {
          const username = member.user?.username || member.username || "User";
          return (
            <div
              key={member.id}
               onClick={() => {
                  if (!isAdmin) return;
                  setSelectedMember(member);
                  setShowMenuFor(member.id);
                }}
              className={`w-8 h-8 ${getAvatarColor(index)} rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white cursor-pointer hover:scale-110 transition-transform relative group`}
            >
              {getInitials(username)}
              <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
                {username}
              </div>
            </div>
          );
        })}
      </div>

      {isAdmin && (
        <button
          onClick={onInviteClick}
          className="w-12 h-9 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center text-sm font-bold transition"
          title="Invite member"
        >
          Add
        </button>
      )}
      {isAdmin && showMenuFor === members.id && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white shadow-lg border rounded-md text-xs z-20 w-36">
          <button
            onClick={() => {
              setConfirmAction("ADMIN");
              setShowMenuFor(null);
            }}
            className="w-full text-left px-3 py-2 hover:bg-gray-100"
          >
            Set as Admin
          </button>

          <button
            onClick={() => {
              setConfirmAction("KICK");
              setShowMenuFor(null);
            }}
            className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50"
          >
            Kick User
          </button>
        </div>
      )}
    </div>
  );
}
