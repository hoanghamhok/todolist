import { useProjectMembers } from "../hooks/useProjectMembers";

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

  const displayMembers = members.slice(0, 3);
  const remainingCount = Math.max(0, members.length - 3);

  const getInitials = (identifier: string) => {
    if (!identifier) return "?";
    // Nếu là email (có @), lấy ký tự đầu của phần username
    if (identifier.includes("@")) {
      return identifier.split("@")[0][0]?.toUpperCase() || "?";
    }
    // Nếu là username, lấy ký tự đầu
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
          const email = member.user?.email || member.email || "";
          return (
            <div
              key={member.id}
              className={`w-8 h-8 ${getAvatarColor(index)} rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white cursor-pointer hover:scale-110 transition-transform relative group`}
            >
              {getInitials(email)}
              <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
                {username}
              </div>
            </div>
          );
        })}

        {remainingCount > 0 && (
          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
            +{remainingCount}
          </div>
        )}
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
    </div>
  );
}
