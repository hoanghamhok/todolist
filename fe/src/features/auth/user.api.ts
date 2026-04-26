import api from "../../api/client";

export const userApi = {
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  updateProfile: (data: { fullName?: string; email?: string }) =>
    api.patch('/users/me', data),

  getStats: () =>
    api.get('/users/me/stats'),

  getProfile: () =>
    api.get('/users/me'),
};
