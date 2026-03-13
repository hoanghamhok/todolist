import { createContext, useContext } from "react";
import type { User, LoginRequest, RegisterRequest } from "../type";

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;

  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateAvatar: (file: File) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};