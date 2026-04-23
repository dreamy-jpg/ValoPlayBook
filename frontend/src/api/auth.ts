import type { LoginRequest, RegisterRequest, AuthResponse, RefreshResponse, User } from '../types';

const API_BASE = '/api';

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export async function register(data: RegisterRequest): Promise<void> {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Ошибка регистрации');
  }
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Ошибка входа');
  }
  return response.json();
}

export async function logout(): Promise<void> {
  await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}

export async function refreshAccessToken(): Promise<string> {
  const response = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Не удалось обновить токен');
  }
  const data: RefreshResponse = await response.json();
  return data.accessToken;
}

export async function getCurrentUser(accessToken: string): Promise<User> {
  const response = await fetch(`${API_BASE}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error('Не удалось получить пользователя');
  }
  return response.json();
}

export async function updateProfile(accessToken: string, username: string): Promise<User> {
  const response = await fetch(`${API_BASE}/auth/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ username }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Ошибка обновления профиля');
  }
  return response.json();
}

export async function uploadAvatar(accessToken: string, file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${API_BASE}/auth/avatar`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    body: formData,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Ошибка загрузки аватара');
  }
  const data = await response.json();
  return data.avatarUrl;
}