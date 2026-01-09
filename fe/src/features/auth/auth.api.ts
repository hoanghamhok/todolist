import api from "../../api/client";
import type { LoginRequest,RegisterRequest,ForgotPasswordRequest,ResetPasswordRequest } from "./type";

export const authApi ={
  login:(data:LoginRequest)=>
    api.post('/auth/login',data),
  register:(data:RegisterRequest)=>
    api.post('/auth/register',data),
  getProfile:()=>
    api.get('/users/me'),
  forgotPassword:(data:ForgotPasswordRequest) =>
    api.post('/auth/forgot-password',data),
  resetPassword: (data: ResetPasswordRequest) =>
    api.post("/auth/reset-password", data),
};