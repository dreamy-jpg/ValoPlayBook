import type { PositionDto, StepAbilityDto } from '../types';
import { useSvgScale } from '../hooks/useSvgScale';
import AbilityOverlay from './AbilityOverlay';
import DraggableAgentIcon from './DraggableAgentIcon';
import DraggableAbilityIcon from './DraggableAbilityIcon';
import './MapSvgPlaceholder.css';

interface MapSvgPlaceholderProps {
  positions: PositionDto[];
  side: 'Attack' | 'Defense';
  abilities: StepAbilityDto[];
  editMode?: boolean;
  onPositionChange?: (positionId: number, newX: number, newY: number) => void;
  onAbilityChange?: (abilityId: number, newX: number, newY: number) => void;
}

export default function MapSvgPlaceholder({
  positions,
  side,
  abilities,
  editMode = false,
  onPositionChange,
  onAbilityChange,
}: MapSvgPlaceholderProps) {
  const width = 800;
  const height = 600;
  const containerRef = useSvgScale(width);
  const bgColor = "#2d2d2d";

  const attackAgents = positions.filter(p => p.isAttacker);
  const defenseAgents = positions.filter(p => !p.isAttacker);

  return (
    <div ref={containerRef} className="border rounded overflow-hidden bg-gray-800 relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="100%"
        className="block"
        style={{ background: bgColor }}
      >
        <text x={width / 2} y={height / 2} fill="#aaa" fontSize={18} textAnchor="middle" dominantBaseline="middle">
          Файл карты не найден
        </text>

        {positions.map((pos) => (
          <DraggableAgentIcon
            key={pos.id}
            pos={pos}
            editMode={editMode}
            onPositionChange={onPositionChange}
            clipPathIdPrefix="placeholder"
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