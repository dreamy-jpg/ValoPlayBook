import type { StepAbilityDto } from '../types';

interface AgentInfo {
  id: number;
  name: string;
}

interface AbilityOverlayProps {
  attackAgents: AgentInfo[];
  defenseAgents: AgentInfo[];
  stepAbilities: StepAbilityDto[];
}

function getAgentIconUrl(agentName: string): string {
  return `/agents/${agentName.toLowerCase()}/agent${agentName}.png`;
}

function getAbilityIconUrl(agentName: string, abilityName: string): string {
  return `/agents/${agentName.toLowerCase()}/abilities/${abilityName.replace(/\s+/g, '_')}.png`;
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
  Killjoy: [
    { name: 'Nanoswarm', maxCharges: 2 },
    { name: 'Alarmbot', maxCharges: 1 },
    { name: 'Turret', maxCharges: 1 },
    { name: 'Lockdown', maxCharges: 1 },
  ],
  Raze: [
    { name: 'Boom Bot', maxCharges: 1 },
    { name: 'Blast Pack', maxCharges: 2 },
    { name: 'Paint Shells', maxCharges: 1 },
    { name: 'Showstopper', maxCharges: 1 },
  ],
  Cypher: [
    { name: 'Trapwire', maxCharges: 2 },
    { name: 'Cyber Cage', maxCharges: 2 },
    { name: 'Spycam', maxCharges: 1 },
    { name: 'Neural Theft', maxCharges: 1 },
  ],
  Fade: [
    { name: 'Prowler', maxCharges: 2 },
    { name: 'Seize', maxCharges: 1 },
    { name: 'Haunt', maxCharges: 1 },
    { name: 'Nightfall', maxCharges: 1 },
  ],
  Reyna: [
    { name: 'Leer', maxCharges: 2 },
    { name: 'Devour', maxCharges: 2 },
    { name: 'Dismiss', maxCharges: 2 },
    { name: 'Empress', maxCharges: 1 },
  ],
  Sage: [
    { name: 'Barrier Orb', maxCharges: 1 },
    { name: 'Slow Orb', maxCharges: 2 },
    { name: 'Healing Orb', maxCharges: 1 },
    { name: 'Resurrection', maxCharges: 1 },
  ],
};

function AgentRow({ agent, stepAbilities, bgColor }: { agent: AgentInfo; stepAbilities: StepAbilityDto[]; bgColor: string }) {
  const abilitiesList = hardcodedAgentAbilities[agent.name] || [];
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
        {abilitiesList.map((ab, idx) => {
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
              <div className="flex justify-center mt-1">
                {Array.from({ length: max }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full mx-px ${
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
}

export default function AbilityOverlay({ attackAgents, defenseAgents, stepAbilities }: AbilityOverlayProps) {
  return (
    <>
      {attackAgents.length > 0 && (
        <div
          className="absolute bottom-0 left-0 pointer-events-none p-4"
          style={{ transform: 'scale(var(--map-scale, 1))', transformOrigin: 'bottom left' }}
        >
          <div className="bg-gray-900/80 backdrop-blur-sm p-4 rounded-lg">
            <div className="flex flex-col gap-3">
              {attackAgents.map(agent => (
                <AgentRow
                  key={agent.id}
                  agent={agent}
                  stepAbilities={stepAbilities}
                  bgColor="#cc5555"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {defenseAgents.length > 0 && (
        <div
          className="absolute bottom-0 right-0 pointer-events-none p-4"
          style={{ transform: 'scale(var(--map-scale, 1))', transformOrigin: 'bottom right' }}
        >
          <div className="bg-gray-900/80 backdrop-blur-sm p-4 rounded-lg">
            <div className="flex flex-col gap-3">
              {defenseAgents.map(agent => (
                <AgentRow
                  key={agent.id}
                  agent={agent}
                  stepAbilities={stepAbilities}
                  bgColor="#5f9f9f"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}