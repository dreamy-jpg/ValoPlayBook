import { useDraggable } from '../hooks/useDraggable';
import { getAbilityIconUrl } from '../utils/iconUrls';
import type { StepAbilityDto } from '../types';

interface DraggableAbilityIconProps {
  ability: StepAbilityDto;
  isAttacker: boolean;
  editMode: boolean;
  onAbilityChange?: (id: number, x: number, y: number) => void;
}

export default function DraggableAbilityIcon({
  ability,
  isAttacker,
  editMode,
  onAbilityChange,
}: DraggableAbilityIconProps) {
  const abilitySize = 24;
  const zoneFill = isAttacker ? 'rgba(220, 80, 80, 0.25)' : 'rgba(80, 200, 200, 0.25)';
  const zoneStroke = isAttacker ? 'rgba(220, 80, 80, 0.7)' : 'rgba(80, 200, 200, 0.7)';
  const lineColor = isAttacker ? 'rgba(220, 80, 80, 0.9)' : 'rgba(80, 200, 200, 0.9)';

  const { position, handleMouseDown } = useDraggable(ability.x ?? 0, ability.y ?? 0, {
    disabled: !editMode,
    onDragEnd: (x, y) => {
      onAbilityChange?.(ability.id, x, y);
    },
  });

  if (ability.x == null || ability.y == null) return null;

  const rotation = ability.rotation ?? 0;
  const zoneType = ability.zoneType || 'Circle';

  const renderZone = () => {
    switch (zoneType) {
      case 'Circle':
        return ability.radius ? (
          <circle
            cx={0}
            cy={0}
            r={ability.radius}
            fill={zoneFill}
            stroke={zoneStroke}
            strokeWidth={2}
            strokeDasharray="4"
            pointerEvents="none"
          />
        ) : null;

      case 'Line':
        return ability.length ? (
          <line
            x1={-ability.length / 2}
            y1={0}
            x2={ability.length / 2}
            y2={0}
            stroke={lineColor}
            strokeWidth={ability.width ?? 4}
            strokeLinecap="round"
            pointerEvents="none"
          />
        ) : null;

      case 'Rectangle':
        return ability.length && ability.width ? (
          <rect
            x={-ability.width / 2}
            y={-ability.length / 2}
            width={ability.width}
            height={ability.length}
            fill={zoneFill}
            stroke={zoneStroke}
            strokeWidth={2}
            strokeDasharray="4"
            pointerEvents="none"
          />
        ) : null;

      case 'Cone':
        // Используем length вместо radius для конуса
        if (!ability.length || !ability.angle) return null;
        const angleRad = (ability.angle * Math.PI) / 180;
        const startX = 0;
        const startY = 0;
        const endX1 = ability.length * Math.sin(angleRad / 2);
        const endY1 = -ability.length * Math.cos(angleRad / 2);
        const endX2 = -ability.length * Math.sin(angleRad / 2);
        const endY2 = -ability.length * Math.cos(angleRad / 2);
        const pathData = `M ${startX},${startY} L ${endX1},${endY1} A ${ability.length},${ability.length} 0 0,1 ${endX2},${endY2} Z`;
        return (
          <path
            d={pathData}
            fill={zoneFill}
            stroke={zoneStroke}
            strokeWidth={2}
            strokeDasharray="4"
            pointerEvents="none"
          />
        );

      default:
        return null;
    }
  };

  return (
    <g transform={`translate(${position.x}, ${position.y}) rotate(${rotation})`}>
      {renderZone()}
      {/* Прозрачная область захвата */}
      <rect
        x={-abilitySize / 2}
        y={-abilitySize / 2}
        width={abilitySize}
        height={abilitySize}
        fill="transparent"
        onMouseDown={handleMouseDown}
        style={{ cursor: editMode ? 'grab' : 'default' }}
      />
      {/* Визуальная иконка */}
      <rect
        x={-abilitySize / 2}
        y={-abilitySize / 2}
        width={abilitySize}
        height={abilitySize}
        rx={6}
        ry={6}
        fill="#1a1a1a"
        pointerEvents="none"
      />
      <image
        href={getAbilityIconUrl(ability.agentName, ability.abilityName)}
        x={-abilitySize / 2}
        y={-abilitySize / 2}
        width={abilitySize}
        height={abilitySize}
        pointerEvents="none"
      />
    </g>
  );
}