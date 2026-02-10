import { useState } from "react";
import { useLeave } from "../../members/hooks/useLeave";
import { LogOut } from "lucide-react";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { useProjectRole } from "../hooks/useProjectRole";
import { useProjectMembers } from "../hooks/useProjectMembers";
import { toast } from "react-hot-toast";
import { useAuth } from "../../auth/hooks/useAuth";

interface LeaveProjectProps {
    projectId:string;
}

export function LeaveProject({
    projectId
}:LeaveProjectProps){
    const {mutate}= useLeave(projectId);
    const [open,setOpen] = useState(false);
    const { data: membersRes, refetch: refetchMembers } = useProjectMembers(projectId);
    const members = membersRes?.data ?? [];
    const {user} = useAuth();
    const { isOwner } = useProjectRole(members, user ?? undefined);
          
    const handleConfirm = () =>{
        if (isOwner) {
            toast.error("Bạn là Owner. Hãy chuyển quyền Owner trước khi rời project.");
            return;
        }
        mutate(projectId);
        setOpen(false);
        window.location.href = "/";
    }

    return(
        <div>
            <div className="pt-3">
                <button
                    onClick={()=>setOpen(true)}
                    className="w-9 h-9 rounded-full bg-red-500 hover:bg-red-800 text-white flex items-center justify-center text-sm font-bold transition self-center"
                    title="Leave Project"
                ><LogOut className="w-5"/>
                </button>
            </div>
            <div>
                <ConfirmDeleteModal 
                isOpen={open}
                title="Leave the Project"
                message="Are you sure to leave that Project ?"
                confirmText="Leave"
                cancelText="Cancel"
                onConfirm={handleConfirm}
                onCancel={() => setOpen(false)}
                />
            </div>
        </div>
    )
}
