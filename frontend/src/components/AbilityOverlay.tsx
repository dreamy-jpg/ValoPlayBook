// AbilityOverlay.tsx (полный код)
import type { StepAbilityDto, AbilityDto } from '../types';
import { getAbilityIconUrl } from '../utils/iconUrls';
import { Panel } from './ui/Panel';
import AgentIcon from './ui/AgentIcon';

interface AgentInfo {
  id: number;
  name: string;
}

interface AbilityOverlayProps {
  attackAgents: AgentInfo[];
  defenseAgents: AgentInfo[];
  stepAbilities: StepAbilityDto[];
  agentAbilities: Record<number, AbilityDto[]>;
}

function ChargesRow({ used, max }: { used: number; max: number }) {
  const rows: JSX.Element[] = [];
  for (let start = 0; start < max; start += 4) {
    const chunk = Array.from({ length: Math.min(4, max - start) }).map((_, i) => {
      const index = start + i;
      return (
        <div
          key={index}
          className={`w-2 h-2 rounded-full mx-px ${
            index < used ? 'bg-gray-400' : 'bg-white'
          }`}
        />
      );
    });
    rows.push(
      <div key={`row-${start}`} className="flex justify-center">
        {chunk}
      </div>
    );
  }
  return <div className="flex flex-col items-center mt-1">{rows}</div>;
}

function AgentRow({
  agent,
  side,
  stepAbilities,
  abilities,
}: {
  agent: AgentInfo;
  side: 'attack' | 'defense';
  stepAbilities: StepAbilityDto[];
  abilities: AbilityDto[];
}) {
  const getUsedCharges = (abilityName: string) =>
    stepAbilities.filter(
      sa => sa.agentName === agent.name && sa.abilityName === abilityName
    ).length;

  return (
    <div className="flex items-center gap-4">
      <AgentIcon agentName={agent.name} side={side} size="md" />
      <div className="flex gap-4">
        {abilities.map((ab, idx) => {
          const used = getUsedCharges(ab.name);
          const max = ab.maxCharges;
          return (
            <div key={idx} className="relative">
              <img
                src={getAbilityIconUrl(agent.name, ab.name)}
                alt={ab.name}
                className={`w-8 h-8 ${used === max ? 'opacity-40' : 'opacity-100'}`}
                title={`${ab.name} (${used}/${max})`}
              />
              {used > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {used}
                </span>
              )}
              <ChargesRow used={used} max={max} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AbilityOverlay({
  attackAgents,
  defenseAgents,
  stepAbilities,
  agentAbilities,
}: AbilityOverlayProps) {
  return (
    <>
      {attackAgents.length > 0 && (
        <div className="absolute bottom-4 left-4 z-10 pointer-events-none w-79">
          <Panel className="p-3 flex flex-col gap-3">
            {attackAgents.map(agent => (
              <AgentRow
                key={agent.id}
                agent={agent}
                side="attack"
                stepAbilities={stepAbilities}
                abilities={agentAbilities[agent.id] || []}
              />
            ))}
          </Panel>
        </div>
      )}

      {defenseAgents.length > 0 && (
        <div className="absolute bottom-4 right-4 z-10 pointer-events-none w-79">
          <Panel className="p-3 flex flex-col gap-3">
            {defenseAgents.map(agent => (
              <AgentRow
                key={agent.id}
                agent={agent}
                side="defense"
                stepAbilities={stepAbilities}
                abilities={agentAbilities[agent.id] || []}
              />
            ))}
          </Panel>
        </div>
      )}
    </>
  );
}