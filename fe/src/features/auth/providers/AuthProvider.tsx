import { useState, useEffect } from "react";
import { AuthContext } from "../contexts/authContext";
import { authApi } from "../auth.api";
import { userApi } from "../user.api";
import type { LoginRequest, RegisterRequest, User } from "../type";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const { data } = await authApi.getProfile();
      setUser(data);
    } catch (err) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginRequest) => {
    const res = await authApi.login(data);

    const accessToken = res.data.accessToken;

    localStorage.setItem("token", accessToken);

    setToken(accessToken);
    setUser(res.data.user);
  };

  const register = async (data: RegisterRequest) => {
    const res = await authApi.register(data);

    const accessToken = res.data.accessToken;

    localStorage.setItem("token", accessToken);

    setToken(accessToken);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");

    setUser(null);
    setToken(null);

    window.location.href = "/";
  };

  const updateAvatar = async (file: File) => {
    const { data } = await userApi.uploadAvatar(file);

    setUser((prev) =>
      prev ? { ...prev, avatarUrl: data.avatar } : prev
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};