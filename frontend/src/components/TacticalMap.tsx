import { useState } from 'react';
import type { PositionDto, StepAbilityDto, AbilityDto } from '../types';
import { useSvgScale } from '../hooks/useSvgScale';
import AbilityOverlay from './AbilityOverlay';
import DraggableAgentIcon from './DraggableAgentIcon';
import DraggableAbilityIcon from './DraggableAbilityIcon';

interface TacticalMapProps {
  mapName: string;
  positions: PositionDto[];
  side: 'Attack' | 'Defense';
  viewBoxWidth: number;
  viewBoxHeight: number;
  abilities: StepAbilityDto[];
  editMode?: boolean;
  onPositionChange?: (positionId: number, newX: number, newY: number) => void;
  onAbilityChange?: (abilityId: number, newX: number, newY: number) => void;
  agentAbilities: Record<number, AbilityDto[]>;
  onAgentDropOnTrash?: (positionId: number) => void; // новое
}

const fallbackBg = "#2d2d2d";

// Зона корзины (левая верхняя часть viewBox)
const TRASH_ZONE = { x: 20, y: 20, size: 42 };

export default function TacticalMap({
  mapName,
  positions,
  side,
  viewBoxWidth,
  viewBoxHeight,
  abilities,
  editMode = false,
  onPositionChange,
  onAbilityChange,
  agentAbilities,
  onAgentDropOnTrash,
}: TacticalMapProps) {
  const containerRef = useSvgScale(viewBoxWidth);
  const [imageError, setImageError] = useState(false);

  const suffix = side === 'Attack' ? 'attack' : 'defense';
  const mapFileName = `${mapName.toLowerCase()}_${suffix}.svg`;
  const mapUrl = `/maps/${mapName.toLowerCase()}/${mapFileName}`;

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
        {imageError ? (
          <rect x={0} y={0} width={viewBoxWidth} height={viewBoxHeight} fill={fallbackBg} />
        ) : (
          <image
            href={mapUrl}
            x={0}
            y={0}
            width={viewBoxWidth}
            height={viewBoxHeight}
            onError={() => setImageError(true)}
          />
        )}

        {imageError && (
          <text
            x={viewBoxWidth / 2}
            y={viewBoxHeight / 2}
            fill="#aaa"
            fontSize={18}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            Файл карты не найден
          </text>
        )}

        {/* Корзина — только в режиме редактирования */}
        {editMode && (
          <g>
            <rect
              x={TRASH_ZONE.x}
              y={TRASH_ZONE.y}
              width={TRASH_ZONE.size}
              height={TRASH_ZONE.size}
              rx={8}
              fill="#1f2937"
              opacity={0.85}
              stroke="#6b7280"
              strokeWidth={2}
              strokeDasharray="4 2"
            />
            <text
              x={TRASH_ZONE.x + TRASH_ZONE.size / 2}
              y={TRASH_ZONE.y + TRASH_ZONE.size / 2 + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#f87171"
              fontSize={22}
              style={{ pointerEvents: 'none' }}
            >
              🗑️
            </text>
          </g>
        )}

        {positions.map((pos) => (
          <DraggableAgentIcon
            key={pos.id}
            pos={pos}
            editMode={editMode}
            onPositionChange={onPositionChange}
            clipPathIdPrefix="tactical"
            trashZone={TRASH_ZONE}
            onDropOnTrash={onAgentDropOnTrash}
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
        agentAbilities={agentAbilities}
      />
    </div>
  );
}