import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import { notificationsAPI } from "../noti.api";
import {useAuth} from "../../auth/hooks/useAuth";
import type { Notification } from "../type";
export const useNotifications = () =>{
    const {user} = useAuth();
    const queryClient=useQueryClient();

    const query= useQuery<Notification[]>({
        queryKey:['notifications'],
        queryFn:async()=>{
            const res = await notificationsAPI.getUserNoti();
            return res.data;
        },
        enabled:!!user,
    })

    const markRead = useMutation({
        mutationFn:(notiId:string) =>{ console.log("CALL API markRead:", notiId);return notificationsAPI.markRead(notiId)},
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["notifications"]})
        }
    })

    return {
    ...query,
    markRead,
  };
    
}