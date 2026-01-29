import { acceptInvite, rejectInvite } from "../api/invitations.api";
import { useMutation,useQueryClient } from "@tanstack/react-query";

export function useInvite(){
    const queryClient = useQueryClient();
    const acceptMutation = useMutation({
        mutationFn:acceptInvite,
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["projectmembers"]})
            queryClient.invalidateQueries({queryKey:["me"]})
        }
    })
    const rejectMutation = useMutation({
        mutationFn:rejectInvite,
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["projectmembers"]})
            queryClient.invalidateQueries({queryKey:["me"]})
        }
    })
    return {acceptMutation,rejectMutation}
}