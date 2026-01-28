import { leaveProject } from '../api/members.api';
import {useMutation,useQueryClient } from "@tanstack/react-query";

export function useLeave(projectId:string){
    const queryClient = useQueryClient();
    const leaveMutation = useMutation({
        mutationFn:leaveProject,
        onSuccess:() =>{
            queryClient.invalidateQueries({queryKey:["projectmembers",projectId]});
            queryClient.invalidateQueries({queryKey:["project",projectId]});
        }
    })
    return leaveMutation;

}