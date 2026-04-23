import PositionEditor from './PositionEditor';
import AbilityEditor from './AbilityEditor';
import type { PositionDto, StepAbilityDto } from '../types';

interface EditorsPanelProps {
  editMode: boolean;
  positions: PositionDto[];
  abilities: StepAbilityDto[];
  onPositionUpdated: (pos: PositionDto) => void;
  onAbilityUpdated: (ability: StepAbilityDto) => void;
}

export default function EditorsPanel({
  editMode,
  positions,
  abilities,
  onPositionUpdated,
  onAbilityUpdated,
}: EditorsPanelProps) {
  if (!editMode) return null;

  return (
    <>
      <PositionEditor
        positions={positions}
        onPositionUpdated={onPositionUpdated}
        disabled={!editMode}
      />
      <AbilityEditor
        abilities={abilities}
        onAbilityUpdated={onAbilityUpdated}
        disabled={!editMode}
      />
    </>
  );
}