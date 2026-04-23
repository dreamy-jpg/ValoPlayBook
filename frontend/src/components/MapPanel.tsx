import RealMapSvg from './RealMapSvg';
import MapSvgPlaceholder from './MapSvgPlaceholder';
import type { PositionDto, StepAbilityDto } from '../types';

interface MapPanelProps {
  mapName: string;
  positions: PositionDto[];
  side: 'Attack' | 'Defense';
  viewBoxWidth: number;
  viewBoxHeight: number;
  abilities: StepAbilityDto[];
  editMode: boolean;
  onPositionChange: (id: number, x: number, y: number) => void;
  onAbilityChange: (id: number, x: number, y: number) => void;
}

const realMaps = [
  'Abyss', 'Ascent', 'Bind', 'Breeze', 'Corrode', 'Fracture',
  'Haven', 'Icebox', 'Lotus', 'Pearl', 'Split', 'Sunset'
];

export default function MapPanel(props: MapPanelProps) {
  const useRealMap = realMaps.includes(props.mapName);

  return useRealMap ? (
    <RealMapSvg {...props} />
  ) : (
    <MapSvgPlaceholder {...props} />
  );
}