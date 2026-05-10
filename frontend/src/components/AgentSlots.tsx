// AgentSlots.tsx (полный код) с рамкой и отступом
import type { PositionDto } from '../types';
import { Panel } from './ui/Panel';
import AgentIcon from './ui/AgentIcon';

interface AgentSlotsProps {
  attackAgents: PositionDto[];
  defenseAgents: PositionDto[];
  onSelectSlot: (side: 'attack' | 'defense', index: number) => void;
  selectedAgentId: number | null;
  editMode: boolean;
}

const SLOTS_PER_SIDE = 5;

export default function AgentSlots({
  attackAgents,
  defenseAgents,
  onSelectSlot,
  selectedAgentId,
  editMode,
}: AgentSlotsProps) {
  const renderSlots = (agents: PositionDto[], side: 'attack' | 'defense') => {
    const slots = [];
    for (let i = 0; i < SLOTS_PER_SIDE; i++) {
      const agent = agents[i] || null;
      const isSelected = agent?.agentId === selectedAgentId;
      slots.push(
        <div
          key={`${side}-${i}`}
          className={`relative p-1.5 border-2 rounded-xl flex items-center justify-center cursor-pointer transition ${
            editMode ? 'hover:border-teal-400' : 'cursor-default'
          } ${
            isSelected
              ? 'border-teal-400 ring-2 ring-teal-400/50'
              : agent
                ? side === 'attack'
                  ? 'border-red-500/80'
                  : 'border-sky-500/80'
                : 'border-gray-600 border-dashed'
          }`}
          onClick={() => {
            if (editMode) {
              onSelectSlot(side, i);
            }
          }}
        >
          {agent ? (
            <AgentIcon agentName={agent.agentName} side={side} size="md" />
          ) : (
            <span className="text-gray-500 text-2xl">+</span>
          )}
        </div>
      );
    }
    return slots;
  };

  return (
    <Panel className="flex items-center justify-between gap-8 px-4 py-3">
      <div className="flex gap-3">{renderSlots(attackAgents, 'attack')}</div>
      <div className="flex gap-3">{renderSlots(defenseAgents, 'defense')}</div>
    </Panel>
  );
}