import { useLeave } from "../../members/hooks/useLeave";
import { LogOut } from "lucide-react";

interface LeaveProjectProps {
    projectId:string;
}

export function LeaveProject({
    projectId
}:LeaveProjectProps){
    const {mutate}= useLeave(projectId);

    return(
        <div className="pt-3">
            <button
                onClick={()=>mutate(projectId)}
                className="w-9 h-9 rounded-full bg-red-500 hover:bg-red-800 text-white flex items-center justify-center text-sm font-bold transition self-center"
                title="Leave Project"
            ><LogOut/>
            </button>
        </div>
    )
}
