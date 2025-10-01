import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { login as loginService } from '../services/auth';
import { LoginRequest } from '../types';

export const useAuth = () => {
  const { setToken, logout: logoutStore, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginService(credentials);
      setToken(response.token);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutStore();
  };

  return {
    login,
    logout,
    isAuthenticated,
    loading,
    error,
  };
};
