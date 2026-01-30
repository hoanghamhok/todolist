import { removeProject } from './../api/projects.api';
import {useMutation,useQueryClient } from "@tanstack/react-query";

export function useRemoveProject(projectId:string){
    const queryClient = useQueryClient();
    const removeProjectMutation = useMutation({
        mutationFn:removeProject,
        onSuccess:() =>{
            queryClient.invalidateQueries({queryKey:["projectmembers",projectId]});
            queryClient.invalidateQueries({queryKey:["project",projectId]});
        }
    })
    return removeProjectMutation;
}
