import { useState } from "react";
import { useProjectMembers } from "../hooks/useProjectMembers";
import { useRemoveMember } from "../../members/hooks/useRemoveMeber";
import { useSetRoleMember } from "../../members/hooks/useSetRoleMember";
import { ConfirmModal } from "../../shared/components/ModalConfirm";

interface MembersAvatarProps {
  projectId: string;
  isAdmin: boolean;
  canSetOwner: boolean;
  onInviteClick: () => void;
}

export function MembersAvatar({
  projectId,
  isAdmin,
  canSetOwner,
  onInviteClick,
}: MembersAvatarProps) {
  const { data: membersRes, isLoading } = useProjectMembers(projectId);
  const members = Array.isArray(membersRes)
    ? membersRes
    : membersRes?.data || [];

  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showMenuFor, setShowMenuFor] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<
    "ADMIN" | "REMOVE_ADMIN" | "OWNER" | "KICK" | null
  >(null);

  const {
    removeMember,
    isLoading: isRemoving,
    isError: isRemoveError,
    error: removeError,
  } = useRemoveMember(projectId);

  const {
    setRole,
    isLoading: isSettingRole,
    isError: isSetRoleError,
    error: setRoleError,
  } = useSetRoleMember(projectId);

  const isConfirmLoading = isRemoving || isSettingRole;

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

  const handleConfirm = () => {
    if (!selectedMember || !confirmAction) return;

    if (confirmAction === "KICK") {
      removeMember(selectedMember.user?.id);
    }

    if (confirmAction === "ADMIN") {
      setRole({
        targetUserId: selectedMember.user?.id,
        role: "ADMIN",
      });
    }

    if (confirmAction === "REMOVE_ADMIN") {
      setRole({
        targetUserId: selectedMember.user?.id,
        role: "MEMBER",
      });
    }

    if (confirmAction === "OWNER") {
      setRole({
        targetUserId: selectedMember.user?.id,
        role: "OWNER",
      });
    }

    setConfirmAction(null);
    setSelectedMember(null);
  };

  if (isLoading) {
    return <div className="text-xs text-gray-500">Loading...</div>;
  }

  return (
    <div className="flex items-center gap-2 pt-3 relative">
      <div className="flex -space-x-2">
        {members.map((member: any, index: number) => {
          const username =
            member.user?.username || member.username || "User";

          return (
            <div
              key={member.userId}
              onClick={() => {
                if (!isAdmin) return;
                setSelectedMember(member);
                setShowMenuFor(member.id);
              }}
              className={`w-8 h-8 ${getAvatarColor(
                index
              )} rounded-full flex items-center justify-center
              text-white text-xs font-bold border-2 border-white
              cursor-pointer hover:scale-110 transition-transform
              relative group`}
            >
              {getInitials(username)}

              <div
                className="hidden group-hover:block absolute bottom-full left-1/2
                -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs
                py-1 px-2 rounded whitespace-nowrap z-10"
              >
                {username} ({member.role})
              </div>

              {isAdmin && showMenuFor === member.id && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2
                  bg-white shadow-lg border rounded-md text-xs z-20 w-44"
                >
                  {/* Set Admin */}
                  {member.role !== "ADMIN" && member.role !== "OWNER" && (
                    <button
                      onClick={() => {
                        setConfirmAction("ADMIN");
                        setShowMenuFor(null);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 text-black"
                    >
                      Set as Admin
                    </button>
                  )}

                  {member.role === "ADMIN" && (
                    <button
                      onClick={() => {
                        setConfirmAction("REMOVE_ADMIN");
                        setShowMenuFor(null);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 text-black"
                    >
                      Remove Admin
                    </button>
                  )}

                  {canSetOwner && member.role !== "OWNER" && (
                    <button
                      onClick={() => {
                        setConfirmAction("OWNER");
                        setShowMenuFor(null);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 text-black font-medium"
                    >
                      Set as Owner
                    </button>
                  )}

                  {member.role !== "OWNER" && (
                    <button
                      onClick={() => {
                        setConfirmAction("KICK");
                        setShowMenuFor(null);
                      }}
                      className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50"
                    >
                      Kick User
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isAdmin && (
        <button
          onClick={onInviteClick}
          className="w-12 h-9 rounded-full bg-blue-500 hover:bg-blue-600
          text-white flex items-center justify-center text-sm font-bold transition"
        >
          Add
        </button>
      )}

      {confirmAction && selectedMember && (
        <ConfirmModal
          title={
            confirmAction === "KICK"
              ? "Kick member"
              : confirmAction === "ADMIN"
              ? "Set Admin"
              : confirmAction === "REMOVE_ADMIN"
              ? "Remove Admin"
              : "Set Owner"
          }
          description={
            confirmAction === "KICK"
              ? `Bạn có chắc muốn kick ${
                  selectedMember.user?.username ||
                  selectedMember.username
                }?`
              : confirmAction === "ADMIN"
              ? `Bạn có chắc muốn set ${
                  selectedMember.user?.username ||
                  selectedMember.username
                } làm Admin?`
              : confirmAction === "REMOVE_ADMIN"
              ? `Bạn có chắc muốn gỡ quyền Admin của ${
                  selectedMember.user?.username ||
                  selectedMember.username
                }?`
              : `Bạn có chắc muốn chuyển quyền OWNER cho ${
                  selectedMember.user?.username ||
                  selectedMember.username
                }?`
          }
          onCancel={() => {
            if (isConfirmLoading) return;
            setConfirmAction(null);
            setSelectedMember(null);
          }}
          onConfirm={handleConfirm}
          loading={isConfirmLoading}
        />
      )}

      {(isRemoveError || isSetRoleError) && (
        <p className="text-xs text-red-500 mt-2">
          {(removeError || setRoleError)?.message ||
            "Có lỗi xảy ra"}
        </p>
      )}
    </div>
  );
}
