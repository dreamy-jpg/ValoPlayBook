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
  agentId: number;
  agentName: string;
  x: number;
  y: number;
  rotation?: number | null;
}

export interface StepDto {
  id: number;
  stepNumber: number;
  comment: string;
  positions: PositionDto[];
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