import api from './api';
import { LoginRequest, LoginResponse } from '../types';

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', credentials);
  return response.data;
};
