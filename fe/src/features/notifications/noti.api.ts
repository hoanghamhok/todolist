import api from '../../api/client'

export const notificationsAPI = {
    getUserNoti:() =>
        api.get('/notifications'),
    markRead:(notiId:string) =>
        api.patch(`/notifications/mark-read/${notiId}`),
    deleteNoti:(notiId:string) =>
        api.delete(`/notifications/delete/${notiId}`)
}