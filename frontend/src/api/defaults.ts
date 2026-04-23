import type { DefaultDto, DefaultListItemDto, PagedResult, MapDto, TeamDto, CommentDto, CreateCommentDto, UpdateStepAbilityDto } from '../types';
import { getAccessToken } from './auth';

const API_BASE = '/api';

async function authFetch(url: string, options: RequestInit = {}) {
  const token = getAccessToken();
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    throw new Error(`Ошибка запроса: ${response.status}`);
  }
  return response;
}

export async function fetchDefaults(params?: {
  mapId?: number;
  teamId?: number;
  side?: string;
  roundNumber?: number;
  pageNumber?: number;
  pageSize?: number;
}): Promise<PagedResult<DefaultListItemDto>> {
  const url = new URL(`${API_BASE}/defaults`, window.location.origin);
  if (params?.mapId) url.searchParams.append('mapId', String(params.mapId));
  if (params?.teamId) url.searchParams.append('teamId', String(params.teamId));
  if (params?.side) url.searchParams.append('side', params.side);
  if (params?.roundNumber) url.searchParams.append('roundNumber', String(params.roundNumber));
  if (params?.pageNumber) url.searchParams.append('pageNumber', String(params.pageNumber));
  if (params?.pageSize) url.searchParams.append('pageSize', String(params.pageSize));

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Ошибка загрузки: ${response.status}`);
  }
  return response.json();
}

export async function fetchMaps(): Promise<MapDto[]> {
  const response = await fetch(`${API_BASE}/maps`);
  if (!response.ok) {
    throw new Error(`Ошибка загрузки карт: ${response.status}`);
  }
  return response.json();
}

export async function fetchTeams(): Promise<TeamDto[]> {
  const response = await fetch(`${API_BASE}/teams`);
  if (!response.ok) {
    throw new Error(`Ошибка загрузки команд: ${response.status}`);
  }
  return response.json();
}

export async function fetchDefaultById(id: number, options?: RequestInit): Promise<DefaultDto> {
  const response = await fetch(`${API_BASE}/defaults/${id}`, options);
  if (!response.ok) {
    throw new Error(`Ошибка загрузки дефолта: ${response.status}`);
  }
  return response.json();
}

export async function fetchComments(defaultId: number): Promise<CommentDto[]> {
  const response = await fetch(`${API_BASE}/defaults/${defaultId}/comments`);
  if (!response.ok) {
    throw new Error(`Ошибка загрузки комментариев: ${response.status}`);
  }
  return response.json();
}

export async function postComment(defaultId: number, comment: CreateCommentDto): Promise<CommentDto> {
  const response = await fetch(`${API_BASE}/defaults/${defaultId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(comment),
  });
  if (!response.ok) {
    throw new Error(`Ошибка отправки комментария: ${response.status}`);
  }
  return response.json();
}

export async function updatePosition(positionId: number, data: { x: number; y: number; rotation?: number | null }) {
  const response = await authFetch(`/api/steppositions/${positionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update position');
}

export async function updateStepAbility(abilityId: number, data: UpdateStepAbilityDto) {
  const response = await authFetch(`/api/stepabilities/${abilityId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update step ability');
}