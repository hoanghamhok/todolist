export function useProjectRole(
  members: { userId: string; role: "OWNER" | "ADMIN" | "MEMBER" }[],
  user?: { id: string; role: "USER" | "SUPER_ADMIN" }
) {
  if (!user) {
    return {
      isAdmin: false,
      canSetOwner: false,
      isSuperAdmin: false,
    };
  }

  if (user.role === "SUPER_ADMIN") {
    return {
      isAdmin: true,
      canSetOwner: true, 
      isSuperAdmin: true,
    };
  }

  const member = members.find(m => m.userId === user.id);

  const isOwner = member?.role === "OWNER";

  return {
    isAdmin:
      member?.role === "ADMIN" ||
      member?.role === "OWNER",
    isOwner: isOwner,
    canSetOwner: isOwner, 
    isSuperAdmin: false,
  };
}
