import { useDraggable } from '../hooks/useDraggable';
import { getAgentIconUrl } from '../utils/iconUrls';
import type { PositionDto } from '../types';

interface DraggableAgentIconProps {
  pos: PositionDto;
  editMode: boolean;
  onPositionChange?: (id: number, x: number, y: number) => void;
  clipPathIdPrefix?: string;
  trashZone?: { x: number; y: number; size: number };
  onDropOnTrash?: (positionId: number) => void;
}

export default function DraggableAgentIcon({
  pos,
  editMode,
  onPositionChange,
  clipPathIdPrefix = 'agent',
  trashZone,
  onDropOnTrash,
}: DraggableAgentIconProps) {
  const agentSize = 32;
  const bgColor = pos.isAttacker ? '#cc5555' : '#5f9f9f';

  const { position, handleMouseDown } = useDraggable(pos.x, pos.y, {
    disabled: !editMode,
    onDragEnd: (x, y) => {
      // Проверяем, попадает ли конечная точка в корзину
      if (trashZone && onDropOnTrash) {
        const inTrash =
          x > trashZone.x &&
          x < trashZone.x + trashZone.size &&
          y > trashZone.y &&
          y < trashZone.y + trashZone.size;
        if (inTrash) {
          onDropOnTrash(pos.id);
          return; // не сохраняем позицию
        }
      }
      // Обычное сохранение позиции
      onPositionChange?.(pos.id, x, y);
    },
  });

  const clipPathId = `${clipPathIdPrefix}-${pos.id}`;

  return (
    <g
      className="agent-icon"
      transform={`translate(${position.x}, ${position.y})`}
      onMouseDown={handleMouseDown}
      style={{ cursor: editMode ? 'grab' : 'default' }}
    >
      <defs>
        <clipPath id={clipPathId}>
          <rect
            x={-agentSize / 2}
            y={-agentSize / 2}
            width={agentSize}
            height={agentSize}
            rx={8}
            ry={8}
          />
        </clipPath>
      </defs>
      <rect
        x={-agentSize / 2}
        y={-agentSize / 2}
        width={agentSize}
        height={agentSize}
        rx={8}
        ry={8}
        fill={bgColor}
      />
      <image
        href={getAgentIconUrl(pos.agentName)}
        x={-agentSize / 2}
        y={-agentSize / 2}
        width={agentSize}
        height={agentSize}
        clipPath={`url(#${clipPathId})`}
        pointerEvents="none"
      />
    </g>
  );
}