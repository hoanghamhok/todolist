type Member = {
    userId:string;
    role:"OWNER" | "ADMIN" | "MEMBER";
}

export function useProjectRole(
    members:Member[],
    userId?:string
){
    const member = members.find(m=>m.userId === userId)
    const isOwner = member?.role === "OWNER";
    const isAdmin = member?.role === "ADMIN" || isOwner;

    return{
        member,role:member?.role,isOwner,isAdmin
    }
}