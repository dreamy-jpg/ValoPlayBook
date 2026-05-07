import type { StepAbilityDto, AbilityDto } from '../types';

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

function getAgentIconUrl(agentName: string): string {
  return `/agents/${agentName.toLowerCase()}/agent${agentName}.png`;
}

function getAbilityIconUrl(agentName: string, abilityName: string): string {
  return `/agents/${agentName.toLowerCase()}/abilities/${abilityName.replace(/\s+/g, '_')}.png`;
}

function ChargesRow({ used, max }: { used: number; max: number }) {
  // Группируем точки по 4 в строке
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

function AgentRow({ agent, stepAbilities, bgColor, abilities }: {
  agent: AgentInfo;
  stepAbilities: StepAbilityDto[];
  bgColor: string;
  abilities: AbilityDto[];
}) {
  const getUsedCharges = (abilityName: string) =>
    stepAbilities.filter(sa => sa.agentName === agent.name && sa.abilityName === abilityName).length;

  return (
    <div className="flex items-center gap-3">
      <div
        className="w-9 h-9 rounded flex items-center justify-center"
        style={{ backgroundColor: bgColor }}
      >
        <img
          src={getAgentIconUrl(agent.name)}
          alt={agent.name}
          className="w-8 h-8 rounded"
        />
      </div>
      <div className="flex gap-2">
        {abilities.map((ab, idx) => {
          const used = getUsedCharges(ab.name);
          const max = ab.maxCharges;
          return (
            <div key={idx} className="relative">
              <img
                src={getAbilityIconUrl(agent.name, ab.name)}
                alt={ab.name}
                className={`w-6 h-6 ${used === max ? 'opacity-40' : 'opacity-100'}`}
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

export default function AbilityOverlay({ attackAgents, defenseAgents, stepAbilities, agentAbilities }: AbilityOverlayProps) {
  return (
    <>
      {attackAgents.length > 0 && (
        <div
          className="absolute bottom-0 left-0 pointer-events-none p-4"
          style={{ transform: 'scale(calc(var(--map-scale, 1) * 1.25))', transformOrigin: 'bottom left' }}
        >
          <div className="bg-gray-900/80 backdrop-blur-sm p-4 rounded-lg">
            <div className="flex flex-col gap-3">
              {attackAgents.map(agent => (
                <AgentRow
                  key={agent.id}
                  agent={agent}
                  stepAbilities={stepAbilities}
                  bgColor="#cc5555"
                  abilities={agentAbilities[agent.id] || []}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {defenseAgents.length > 0 && (
        <div
          className="absolute bottom-0 right-0 pointer-events-none p-4"
          style={{ transform: 'scale(calc(var(--map-scale, 1) * 1.25))', transformOrigin: 'bottom right' }}
        >
          <div className="bg-gray-900/80 backdrop-blur-sm p-4 rounded-lg">
            <div className="flex flex-col gap-3">
              {defenseAgents.map(agent => (
                <AgentRow
                  key={agent.id}
                  agent={agent}
                  stepAbilities={stepAbilities}
                  bgColor="#5f9f9f"
                  abilities={agentAbilities[agent.id] || []}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}