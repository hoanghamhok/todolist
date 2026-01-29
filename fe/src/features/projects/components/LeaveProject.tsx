import { useState } from "react";
import { useLeave } from "../../members/hooks/useLeave";
import { LogOut } from "lucide-react";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

interface LeaveProjectProps {
    projectId:string;
}

export function LeaveProject({
    projectId
}:LeaveProjectProps){
    const {mutate}= useLeave(projectId);
    const [open,setOpen] = useState(false)

    const handleConfirm = () =>{
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
