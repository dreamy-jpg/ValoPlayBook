import MapPanel from './MapPanel';
import AgentSlotBar from './AgentSlots';
import type { PositionDto, StepAbilityDto, AgentDto, AbilityDto } from '../types';

interface MapColumnProps {
  stepNumber?: number;
  positions: PositionDto[];
  mapName: string;
  side: 'Attack' | 'Defense';
  viewBox: { width: number; height: number };
  abilities: StepAbilityDto[];
  editMode: boolean;
  onPositionChange: (id: number, x: number, y: number) => void;
  onAbilityChange: (id: number, x: number, y: number) => void;
  agentAbilities: Record<number, AbilityDto[]>;
  onAgentDropOnTrash: (positionId: number) => void;
  agents: AgentDto[];
  onSelectAgent: (pos: PositionDto | null) => void;
  onAddAgent: (side: 'attack' | 'defense') => void;
}

export default function MapColumn({
  stepNumber,
  positions,
  mapName,
  side,
  viewBox,
  abilities,
  editMode,
  onPositionChange,
  onAbilityChange,
  agentAbilities,
  onAgentDropOnTrash,
  agents,
  onSelectAgent,
  onAddAgent,
}: MapColumnProps) {
  return (
    <div className="w-full max-w-3xl xl:max-w-4xl mx-auto">
      <MapPanel
        mapName={mapName}
        positions={positions}
        side={side}
        viewBoxWidth={viewBox.width}
        viewBoxHeight={viewBox.height}
        abilities={abilities}
        editMode={editMode}
        onPositionChange={onPositionChange}
        onAbilityChange={onAbilityChange}
        agentAbilities={agentAbilities}
        onAgentDropOnTrash={onAgentDropOnTrash}
      />

      {editMode && (
        <div className="mt-4">
          <AgentSlotBar
            positions={positions}
            allAgents={agents}
            onSelectAgent={onSelectAgent}
            onAddAgent={onAddAgent}
          />
        </div>
      )}
    </div>
  );
}