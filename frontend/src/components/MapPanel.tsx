import TacticalMap from './TacticalMap';
import type { PositionDto, StepAbilityDto, AbilityDto } from '../types';

interface MapPanelProps {
  mapName: string;
  positions: PositionDto[];
  side: 'Attack' | 'Defense';
  viewBoxWidth: number;
  viewBoxHeight: number;
  abilities: StepAbilityDto[];
  editMode: boolean;
  onPositionChange: (id: number, x: number, y: number) => void;
  onAbilityChange: (id: number, x: number, y: number) => void;
  agentAbilities: Record<number, AbilityDto[]>;
  onAgentDropOnTrash?: (positionId: number) => void;
}

export default function MapPanel(props: MapPanelProps) {
  return <TacticalMap {...props} />;
}