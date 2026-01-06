import api from "../../api/client";
import type { LoginRequest,RegisterRequest } from "./type";

export const authApi ={
  login:(data:LoginRequest)=>
    api.post('/auth/login',data),
  register:(data:RegisterRequest)=>
    api.post('/auth/register',data),
  getProfile:()=>
    api.get('/users/me'),
};