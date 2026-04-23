import type { StepAbilityDto } from '../types';

interface AgentInfo {
  id: number;
  name: string;
}

interface AbilityPanelProps {
  agents: AgentInfo[];
  abilities: StepAbilityDto[];
  stepAbilities: StepAbilityDto[];
}

function getAgentIconUrl(agentName: string): string {
  return `/agents/${agentName.toLowerCase()}/agent${agentName}.png`;
}

function getAbilityIconUrl(agentName: string, abilityName: string): string {
  return `/agents/${agentName.toLowerCase()}/abilities_table/${abilityName.replace(/\s+/g, '_')}.png`;
}

const hardcodedAgentAbilities: Record<string, { name: string; maxCharges: number }[]> = {
  Brimstone: [
    { name: 'Incendiary', maxCharges: 1 },
    { name: 'Stim Beacon', maxCharges: 2 },
    { name: 'Sky Smoke', maxCharges: 3 },
    { name: 'Orbital Strike', maxCharges: 1 },
  ],
  Jett: [
    { name: 'Cloudburst', maxCharges: 3 },
    { name: 'Updraft', maxCharges: 2 },
    { name: 'Tailwind', maxCharges: 1 },
    { name: 'Blade Storm', maxCharges: 1 },
  ],
  Omen: [
    { name: 'Shrouded Step', maxCharges: 2 },
    { name: 'Paranoia', maxCharges: 1 },
    { name: 'Dark Cover', maxCharges: 2 },
    { name: 'From the Shadows', maxCharges: 1 },
  ],
  Sova: [
    { name: 'Owl Drone', maxCharges: 1 },
    { name: 'Shock Bolt', maxCharges: 2 },
    { name: 'Recon Bolt', maxCharges: 1 },
    { name: "Hunter's Fury", maxCharges: 1 },
  ],
  Sage: [
    { name: 'Barrier Orb', maxCharges: 1 },
    { name: 'Slow Orb', maxCharges: 2 },
    { name: 'Healing Orb', maxCharges: 1 },
    { name: 'Resurrection', maxCharges: 1 },
  ],
  Phoenix: [
    { name: 'Blaze', maxCharges: 1 },
    { name: 'Curveball', maxCharges: 2 },
    { name: 'Hot Hands', maxCharges: 1 },
    { name: 'Run it Back', maxCharges: 1 },
  ],
};

export default function AbilityPanel({ agents, abilities, stepAbilities }: AbilityPanelProps) {
  const getUsedCharges = (agentName: string, abilityName: string): number => {
    return stepAbilities.filter(
      sa => sa.agentName === agentName && sa.abilityName === abilityName
    ).length;
  };

  return (
    <div className="mt-4 p-4 bg-gray-900 rounded-lg">
      <h3 className="text-lg font-semibold mb-3 text-white">Способности</h3>
      <div className="flex flex-wrap gap-6">
        {agents.map(agent => {
          const abilitiesList = hardcodedAgentAbilities[agent.name] || [];
          return (
            <div key={agent.id} className="flex items-center gap-3 bg-gray-800 p-3 rounded">
              <img
                src={getAgentIconUrl(agent.name)}
                alt={agent.name}
                className="w-10 h-10 rounded"
              />
              <div className="flex gap-2">
                {abilitiesList.map((ab, idx) => {
                  const used = getUsedCharges(agent.name, ab.name);
                  const max = ab.maxCharges;
                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="relative">
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
                      </div>
                      <div className="flex gap-0.5 mt-1">
                        {Array.from({ length: max }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < used ? 'bg-gray-400' : 'bg-white'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}