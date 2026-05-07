import type { PositionDto, AgentDto } from '../types';

interface AgentSlotBarProps {
  positions: PositionDto[];          // позиции текущего шага
  allAgents: AgentDto[];            // все агенты из справочника
  onSelectAgent: (position: PositionDto | null) => void;  // выбор занятого слота
  onAddAgent: (side: 'attack' | 'defense') => void;       // клик по пустому слоту
}

const SLOTS_PER_SIDE = 5;

function getAgentIconUrl(name: string) {
  return `/agents/${name.toLowerCase()}/agent${name}.png`;
}

export default function AgentSlotBar({ positions, allAgents, onSelectAgent, onAddAgent }: AgentSlotBarProps) {
  const attackers = positions.filter(p => p.isAttacker);
  const defenders = positions.filter(p => !p.isAttacker);

  const renderSlots = (sidePositions: PositionDto[], side: 'attack' | 'defense') => {
    const slots = [];
    for (let i = 0; i < SLOTS_PER_SIDE; i++) {
      const pos = sidePositions[i] || null;
      slots.push(
        <div
          key={`${side}-${i}`}
          className="relative w-14 h-14 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer hover:border-teal-400 transition"
          style={{ borderColor: pos ? (side === 'attack' ? '#cc5555' : '#5f9f9f') : '#4a5568' }}
          onClick={() => {
            if (pos) {
              onSelectAgent(pos);
            } else {
              onAddAgent(side);
            }
          }}
        >
          {pos ? (
            <img src={getAgentIconUrl(pos.agentName)} alt={pos.agentName} className="w-12 h-12 rounded" />
          ) : (
            <span className="text-gray-500 text-2xl">+</span>
          )}
        </div>
      );
    }
    return slots;
  };

  return (
    <div className="flex items-center justify-between gap-8 px-4 py-3 bg-gray-800/90 backdrop-blur-sm rounded-lg border border-gray-700">
      {/* Атакующие */}
      <div className="flex gap-3">
        {renderSlots(attackers, 'attack')}
      </div>

      {/* Защитники */}
      <div className="flex gap-3">
        {renderSlots(defenders, 'defense')}
      </div>
    </div>
  );
}