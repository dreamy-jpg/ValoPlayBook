export interface TeamDto {
  id: number;
  name: string;
  logoUrl?: string | null;
}

export interface MapDto {
  id: number;
  name: string;
  imageUrl?: string | null;
}

export interface PositionDto {
  id: number; // новое поле
  agentId: number;
  agentName: string;
  x: number;
  y: number;
  rotation?: number | null;
  isAttacker: boolean;
}

export interface StepAbilityDto {
  id: number;
  activationStepId: number;
  abilityId: number;
  abilityName: string;
  agentId: number;
  agentName: string;
  x?: number | null;
  y?: number | null;
  rotation?: number | null;
  zoneType: 'Circle' | 'Line' | 'Rectangle' | 'Cone';
  radius?: number | null;
  length?: number | null;
  width?: number | null;
  angle?: number | null;
  durationSteps: number;
}

export interface StepDto {
  id: number;
  stepNumber: number;
  comment: string;
  positions: PositionDto[];
  abilities: StepAbilityDto[];
}

export interface DefaultDto {
  id: number;
  title: string;
  description?: string | null;
  team: TeamDto;
  map: MapDto;
  side: string;
  roundNumber?: number | null;
  opponentTeamName?: string | null;
  youtubeUrl?: string | null;
  steps: StepDto[];
}

export interface CommentDto {
  id: number;
  authorName: string;
  authorEmail?: string | null;
  content: string;
  createdAt: string;
}

export interface CreateCommentDto {
  authorName: string;
  authorEmail?: string | null;
  content: string;
}

export interface UpdateStepAbilityDto {
  x?: number;
  y?: number;
  rotation?: number | null;
  radius?: number | null;
  length?: number | null;
  width?: number | null;
  angle?: number | null;
  durationSteps?: number;
  zoneType?: string;
}

export interface DefaultListItemDto {
  id: number;
  title: string;
  description?: string;
  team: TeamDto;
  map: MapDto;
  side: string;
  roundNumber?: number;
  opponentTeamName?: string;
  youtubeUrl?: string;
  stepCount: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface User {
  id: number;
  email: string;
  username: string;
  role: 'Admin' | 'User';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  email: string;
  username: string;
  role: string;
  accessToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}