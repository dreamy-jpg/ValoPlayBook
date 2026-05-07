import { useState } from 'react';
import toast from 'react-hot-toast';
import type { PositionDto } from '../types';
import { createPosition, deletePosition } from '../api/defaults';

interface UseAgentActionsParams {
  id: string | undefined;
  selectedStep: any | null;
  updateStepData: (stepId: number, updater: (step: any) => any) => void;
  setSelectedStep: (step: any) => void;
  editingAgent: PositionDto | null;
  setEditingAgent: (pos: PositionDto | null) => void;
}

export function useAgentActions({
  id,
  selectedStep,
  updateStepData,
  setSelectedStep,
  editingAgent,
  setEditingAgent,
}: UseAgentActionsParams) {
  const [creatingSlot, setCreatingSlot] = useState<{ side: 'attack' | 'defense' } | null>(null);

  const handleSelectAgent = (pos: PositionDto | null) => {
    setEditingAgent(pos);
    setCreatingSlot(null);
  };

  const handleAddAgent = (side: 'attack' | 'defense') => {
    setEditingAgent(null);
    setCreatingSlot({ side });
  };

  const handleCreateAgent = async (agentId: number) => {
    if (!creatingSlot || !selectedStep) return;
    const numericId = id ? parseInt(id, 10) : NaN;
    if (isNaN(numericId)) return;

    const isAttacker = creatingSlot.side === 'attack';
    try {
      const newPos = await createPosition(numericId, selectedStep.id, {
        agentId,
        isAttacker,
        x: 512,
        y: 512,
      });

      const updatedPositions = [...selectedStep.positions, newPos];
      updateStepData(selectedStep.id, (step: any) => ({
        ...step,
        positions: updatedPositions,
      }));
      setSelectedStep((prev: any) => (prev ? { ...prev, positions: updatedPositions } : null));

      setEditingAgent(newPos);
      setCreatingSlot(null);
      toast.success('Агент добавлен');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка добавления агента');
    }
  };

  const handleAgentReplaced = (updatedPos: PositionDto) => {
    if (!selectedStep) return;
    updateStepData(selectedStep.id, (step: any) => ({
      ...step,
      positions: step.positions.map((p: PositionDto) => (p.id === updatedPos.id ? updatedPos : p)),
    }));
    setSelectedStep((prev: any) =>
      prev
        ? {
            ...prev,
            positions: prev.positions.map((p: PositionDto) => (p.id === updatedPos.id ? updatedPos : p)),
          }
        : null
    );
    setEditingAgent(updatedPos);
  };

  const handleAgentDropOnTrash = async (positionId: number) => {
    try {
      await deletePosition(positionId);
      if (!selectedStep) return;
      updateStepData(selectedStep.id, (step: any) => ({
        ...step,
        positions: step.positions.filter((p: PositionDto) => p.id !== positionId),
      }));
      setSelectedStep((prev: any) =>
        prev
          ? { ...prev, positions: prev.positions.filter((p: PositionDto) => p.id !== positionId) }
          : null
      );
      if (editingAgent?.id === positionId) {
        setEditingAgent(null);
      }
      toast.success('Агент удалён');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка удаления');
    }
  };

  return {
    creatingSlot,
    setCreatingSlot,
    handleSelectAgent,
    handleAddAgent,
    handleCreateAgent,
    handleAgentReplaced,
    handleAgentDropOnTrash,
  };
}