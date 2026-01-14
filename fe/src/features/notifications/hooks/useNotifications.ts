import {useQuery} from "@tanstack/react-query";
import { notificationsAPI } from "../noti.api";
import {useAuth} from "../../auth/hooks/useAuth";
import type { Notification } from "../type";
export const useNotifications = () =>{
    const {user} = useAuth();

    return useQuery<Notification[]>({
        queryKey:['notifications'],
        queryFn:async()=>{
            const res = await notificationsAPI.getUserNoti();
            return res.data;
        },
        enabled:!!user,
    })
}