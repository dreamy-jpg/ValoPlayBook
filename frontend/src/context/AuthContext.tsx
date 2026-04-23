import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  login as apiLogin,
  logout as apiLogout,
  refreshAccessToken,
  getCurrentUser,
  setAccessToken,
  updateProfile,
  uploadAvatar,
} from '../api/auth';
import type { User, LoginRequest, AuthResponse } from '../types';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (username: string) => Promise<void>;
  updateAvatar: (file: File) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const newToken = await refreshAccessToken();
        setAccessTokenState(newToken);
        setAccessToken(newToken);
        const userData = await getCurrentUser(newToken);
        setUser(userData);
      } catch (error) {
        setUser(null);
        setAccessTokenState(null);
        setAccessToken(null);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const response: AuthResponse = await apiLogin(data);
    setAccessTokenState(response.accessToken);
    setAccessToken(response.accessToken);
    setUser({
      id: response.id,
      email: response.email,
      username: response.username,
      role: response.role as 'Admin' | 'User',
    });
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
    setAccessTokenState(null);
    setAccessToken(null);
  }, []);

  const updateUser = useCallback(async (username: string) => {
    if (!accessToken || !user) return;
    const updatedUser = await updateProfile(accessToken, username);
    setUser(updatedUser);
  }, [accessToken, user]);

  const updateAvatar = useCallback(async (file: File) => {
    if (!accessToken || !user) return;
    const newAvatarUrl = await uploadAvatar(accessToken, file);
    setUser({ ...user, avatarUrl: newAvatarUrl });
  }, [accessToken, user]);

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, login, logout, updateUser, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  );
};