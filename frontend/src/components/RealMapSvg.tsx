import type { PositionDto, StepAbilityDto } from '../types';
import { useSvgScale } from '../hooks/useSvgScale';
import AbilityOverlay from './AbilityOverlay';
import DraggableAgentIcon from './DraggableAgentIcon';
import DraggableAbilityIcon from './DraggableAbilityIcon';
import './MapSvgPlaceholder.css';

interface RealMapSvgProps {
  mapName: string;
  positions: PositionDto[];
  side: 'Attack' | 'Defense';
  viewBoxWidth: number;
  viewBoxHeight: number;
  abilities: StepAbilityDto[];
  editMode?: boolean;
  onPositionChange?: (positionId: number, newX: number, newY: number) => void;
  onAbilityChange?: (abilityId: number, newX: number, newY: number) => void;
}

export default function RealMapSvg({
  mapName,
  positions,
  side,
  viewBoxWidth,
  viewBoxHeight,
  abilities,
  editMode = false,
  onPositionChange,
  onAbilityChange,
}: RealMapSvgProps) {
  const containerRef = useSvgScale(viewBoxWidth);
  const suffix = side === 'Attack' ? 'attack' : 'defense';
  const mapFileName = `${mapName.toLowerCase()}_map_${suffix}.svg`;
  const mapUrl = `/maps/${mapFileName}`;

  const attackAgents = positions.filter(p => p.isAttacker);
  const defenseAgents = positions.filter(p => !p.isAttacker);

  return (
    <div ref={containerRef} className="border rounded overflow-hidden bg-gray-800 relative">
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        width="100%"
        height="100%"
        className="block"
      >
        <image href={mapUrl} x={0} y={0} width={viewBoxWidth} height={viewBoxHeight} />

        {positions.map((pos) => (
          <DraggableAgentIcon
            key={pos.id}
            pos={pos}
            editMode={editMode}
            onPositionChange={onPositionChange}
            clipPathIdPrefix="real"
          />
        ))}

        {abilities.map((ability) => {
          const agentPosition = positions.find(p => p.agentId === ability.agentId);
          const isAttacker = agentPosition?.isAttacker ?? (side === 'Attack');
          return (
            <DraggableAbilityIcon
              key={ability.id}
              ability={ability}
              isAttacker={isAttacker}
              editMode={editMode}
              onAbilityChange={onAbilityChange}
            />
          );
        })}
      </svg>
      <AbilityOverlay
        attackAgents={attackAgents.map(p => ({ id: p.agentId, name: p.agentName }))}
        defenseAgents={defenseAgents.map(p => ({ id: p.agentId, name: p.agentName }))}
        stepAbilities={abilities}
      />
    </div>
  );
}