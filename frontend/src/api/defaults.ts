import type { DefaultDto, DefaultListItemDto, PagedResult, MapDto, TeamDto, CommentDto, CreateCommentDto, UpdateStepAbilityDto, AgentDto, PositionDto, StepDto, StepAbilityDto } from '../types';
import { getAccessToken, fetchWithAuth } from './auth';

const API_BASE = '/api';

export async function fetchDefaults(params?: {
  mapId?: number;
  teamId?: number;
  side?: string;
  roundNumber?: number;
  createdByUserId?: number;
  pageNumber?: number;
  pageSize?: number;
}): Promise<PagedResult<DefaultListItemDto>> {
  const url = new URL(`${API_BASE}/defaults`, window.location.origin);
  if (params?.mapId) url.searchParams.append('mapId', String(params.mapId));
  if (params?.teamId) url.searchParams.append('teamId', String(params.teamId));
  if (params?.side) url.searchParams.append('side', params.side);
  if (params?.roundNumber) url.searchParams.append('roundNumber', String(params.roundNumber));
  if (params?.createdByUserId) url.searchParams.append('createdByUserId', String(params.createdByUserId));
  if (params?.pageNumber) url.searchParams.append('pageNumber', String(params.pageNumber));
  if (params?.pageSize) url.searchParams.append('pageSize', String(params.pageSize));

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Ошибка загрузки: ${response.status}`);
  }
  return response.json();
}

export async function createDefault(data: {
  title: string;
  teamId: number;
  mapId: number;
  side: string;
  description?: string;
  roundNumber?: number;
  opponentTeamName?: string;
  youtubeUrl?: string;
  imageUrl?: string;
}): Promise<DefaultDto> {
  const response = await fetchWithAuth(`${API_BASE}/defaults`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Ошибка создания тактики');
  }
  return response.json();
}

export async function deleteDefault(id: number): Promise<void> {
  await fetchWithAuth(`${API_BASE}/defaults/${id}`, { method: 'DELETE' });
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

export async function fetchComments(
  defaultId: number,
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<PagedResult<CommentDto>> {
  const url = new URL(`${API_BASE}/defaults/${defaultId}/comments`, window.location.origin);
  url.searchParams.append('pageNumber', String(pageNumber));
  url.searchParams.append('pageSize', String(pageSize));

  const response = await fetch(url.toString());
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

export async function deleteComment(defaultId: number, commentId: number): Promise<void> {
  await fetchWithAuth(`${API_BASE}/defaults/${defaultId}/comments/${commentId}`, {
    method: 'DELETE',
  });
}

export async function createPosition(
  defaultId: number,
  stepId: number,
  data: { agentId: number; isAttacker: boolean; x?: number; y?: number }
): Promise<PositionDto> {
  const response = await fetchWithAuth(`/api/defaults/${defaultId}/steps/${stepId}/positions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Ошибка добавления агента');
  }
  return response.json();
}

export async function deletePosition(positionId: number): Promise<void> {
  await fetchWithAuth(`/api/steppositions/${positionId}`, { method: 'DELETE' });
}

export async function updatePosition(positionId: number, data: { x: number; y: number; rotation?: number | null }) {
  const response = await fetchWithAuth(`/api/steppositions/${positionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update position');
}

export async function createStep(
  defaultId: number,
  data: { stepNumber: number; comment?: string }
): Promise<StepDto> {
  const response = await fetchWithAuth(`${API_BASE}/defaults/${defaultId}/steps`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Ошибка создания шага');
  return response.json();
}

export async function updateStepAbility(abilityId: number, data: UpdateStepAbilityDto) {
  const response = await fetchWithAuth(`/api/stepabilities/${abilityId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update step ability');
}

export async function deleteStep(defaultId: number, stepId: number): Promise<void> {
  await fetchWithAuth(`${API_BASE}/defaults/${defaultId}/steps/${stepId}`, {
    method: 'DELETE',
  });
}

export async function createStepAbility(
  data: {
    abilityId: number;
    agentId: number;
    activationStepId: number;
    x?: number;
    y?: number;
    rotation?: number;
  }
): Promise<StepAbilityDto> {
  const response = await fetchWithAuth(`${API_BASE}/stepabilities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Ошибка создания способности');
  }
  return response.json();
}

export async function deleteStepAbility(id: number): Promise<void> {
  await fetchWithAuth(`${API_BASE}/stepabilities/${id}`, { method: 'DELETE' });
}

export async function replaceAgent(positionId: number, newAgentId: number): Promise<PositionDto> {
  const response = await fetchWithAuth(`/api/steppositions/${positionId}/replace`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agentId: newAgentId }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Ошибка замены агента');
  }
  return response.json();
}

export async function updateStepComment(
  defaultId: number,
  stepId: number,
  comment: string
): Promise<void> {
  await fetchWithAuth(`${API_BASE}/defaults/${defaultId}/steps/${stepId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comment }),
  });
}

export async function fetchAgents(): Promise<AgentDto[]> {
  const response = await fetch(`${API_BASE}/agents`);
  if (!response.ok) {
    throw new Error(`Ошибка загрузки агентов: ${response.status}`);
  }
  return response.json();
}

export async function uploadDefaultImage(id: number, file: File): Promise<{ imageUrl: string }> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetchWithAuth(`${API_BASE}/defaults/${id}/image`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Ошибка загрузки изображения');
  }
  return response.json();
}

export async function updateComment(
  defaultId: number,
  commentId: number,
  content: string
): Promise<void> {
  await fetchWithAuth(`${API_BASE}/defaults/${defaultId}/comments/${commentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
}