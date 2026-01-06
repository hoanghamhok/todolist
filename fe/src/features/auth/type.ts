
import type { paths } from "../../types/openapi"

export type RegisterRequest =
  paths["/auth/register"]["post"]["requestBody"]["content"]["application/json"];

export type LoginRequest =
  paths["/auth/login"]["post"]["requestBody"]["content"]["application/json"];

export type LoginResult =
  paths["/auth/login"]["post"]["responses"]["200"]["content"]["application/json"];

export type RegisterResult =
  paths["/auth/register"]["post"]["responses"]["201"]["content"]["application/json"];

export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}