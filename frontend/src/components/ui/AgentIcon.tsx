// AgentIcon.tsx (полный код)
import { getAgentIconUrl, getAgentColor } from '../../utils/iconUrls';

interface AgentIconProps {
  agentName: string;
  side?: 'attack' | 'defense';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 32,
  nm: 40,
  md: 48,
  lg: 56,
};

export default function AgentIcon({ agentName, side, size = 'md', className = '' }: AgentIconProps) {
  const dim = sizeMap[size];
  const bgColor = getAgentColor(side);

  return (
    <div
      className={`flex items-center justify-center overflow-hidden rounded-lg ${className}`}
      style={{
        width: dim,
        height: dim,
        backgroundColor: bgColor,
      }}
    >
      <img
        src={getAgentIconUrl(agentName)}
        alt={agentName}
        className="w-full h-full object-cover rounded-md"
      />
    </div>
  );
}