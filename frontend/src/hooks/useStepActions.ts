import { useState } from 'react';
import toast from 'react-hot-toast';
import { createStep, deleteStep } from '../api/defaults';

interface UseStepActionsParams {
  id: string | undefined;
  reload: () => void;
  selectedStepId: number | null;
  onStepDeleted: (stepId: number) => void;
}

export function useStepActions({ id, reload, selectedStepId, onStepDeleted }: UseStepActionsParams) {
  const [showAddStep, setShowAddStep] = useState(false);
  const [newStepNumber, setNewStepNumber] = useState('');
  const [newStepComment, setNewStepComment] = useState('');
  const [addingStep, setAddingStep] = useState(false);

  const handleAddStep = async () => {
    const stepNum = parseInt(newStepNumber, 10);
    if (isNaN(stepNum) || stepNum < 1) {
      toast.error('Введите корректный номер шага');
      return;
    }
    const numericId = id ? parseInt(id, 10) : NaN;
    if (isNaN(numericId)) return;

    setAddingStep(true);
    try {
      await createStep(numericId, { stepNumber: stepNum, comment: newStepComment || undefined });
      await reload();
      setNewStepNumber('');
      setNewStepComment('');
      setShowAddStep(false);
      toast.success('Шаг добавлен');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка создания шага');
    } finally {
      setAddingStep(false);
    }
  };

  const handleDeleteStep = async (stepId: number) => {
    const numericId = id ? parseInt(id, 10) : NaN;
    if (isNaN(numericId)) return;
    try {
      await deleteStep(numericId, stepId);
      await reload();
      if (selectedStepId === stepId) {
        onStepDeleted(stepId);
      }
      toast.success('Шаг удалён');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка удаления шага');
    }
  };

  return {
    showAddStep,
    setShowAddStep,
    newStepNumber,
    setNewStepNumber,
    newStepComment,
    setNewStepComment,
    addingStep,
    handleAddStep,
    handleDeleteStep,
  };
}