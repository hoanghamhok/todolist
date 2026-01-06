import api from "../../api/client";

export const authService = {
  login: (email,username, password) => 
    api.post('/auth/login', { email, password,username}),
  
  register: (email, password,username) => 
    api.post('/auth/register', { email, password,username}),
};