import React, { createContext, useState, useEffect } from 'react';
import { authApi } from '../auth.api';
import type { AuthContextType, LoginRequest, RegisterRequest, User } from '../../auth/type';

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const { data } = await authApi.getProfile();
      setUser(data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      logout();
    }
  };

  const login = async (data: LoginRequest) => {
  setLoading(true);
  try {
    const { data: res } = await authApi.login(data);

    setToken(res.accessToken);
    setUser(res.user);
    localStorage.setItem("token", res.accessToken);

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Login failed",
    };
  } finally {
    setLoading(false);
  }
 };

  const register = async (data: RegisterRequest) => {
  setLoading(true);
  try {
    const { data: res } = await authApi.register(data);

    setToken(res.accessToken);
    setUser(res.user);
    localStorage.setItem("token", res.accessToken);

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Registration failed",
    };
  } finally {
    setLoading(false);
  }
 };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, logout,login,register }}>
      {children}
    </AuthContext.Provider>
  );
};





