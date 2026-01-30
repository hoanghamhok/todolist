import { useState } from "react";
import { useRemoveProject } from "../hooks/useProjectDelete";
import { Trash2Icon } from "lucide-react";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

interface RemoveProjectProps {
    projectId:string;
}

export function RemoveProject({
    projectId
}:RemoveProjectProps){
    const {mutate}= useRemoveProject(projectId);
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
                ><Trash2Icon className="w-5"/>
                </button>
            </div>
            <div>
                <ConfirmDeleteModal 
                isOpen={open}
                title="Delete the Project"
                message="Are you sure to remove that Project ? You will lose all your data in this project"
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleConfirm}
                onCancel={() => setOpen(false)}
                />
            </div>
        </div>
    )
}
