import toast from 'react-hot-toast';
import type { StepAbilityDto } from '../types';

interface UseAbilityActionsParams {
  selectedStep: any | null;
  updateStepData: (stepId: number, updater: (step: any) => any) => void;
  setSelectedStep: (step: any) => void;
}

export function useAbilityActions({ selectedStep, updateStepData, setSelectedStep }: UseAbilityActionsParams) {
  const handleAbilityAdded = (newAbility: StepAbilityDto) => {
    if (!selectedStep) return;
    updateStepData(selectedStep.id, (step: any) => ({
      ...step,
      abilities: [...step.abilities, newAbility],
    }));
    setSelectedStep((prev: any) =>
      prev ? { ...prev, abilities: [...prev.abilities, newAbility] } : null
    );
  };

  const handleAbilityDeleted = (abilityId: number) => {
    if (!selectedStep) return;
    updateStepData(selectedStep.id, (step: any) => ({
      ...step,
      abilities: step.abilities.filter((a: StepAbilityDto) => a.id !== abilityId),
    }));
    setSelectedStep((prev: any) =>
      prev
        ? {
            ...prev,
            abilities: prev.abilities.filter((a: StepAbilityDto) => a.id !== abilityId),
          }
        : null
    );
  };

  return { handleAbilityAdded, handleAbilityDeleted };
}