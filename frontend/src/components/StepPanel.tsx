// StepPanel.tsx (полный код)
import StepSelector from './StepSelector';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import type { StepDto } from '../types';

interface StepPanelProps {
  title: string;
  steps: StepDto[];
  selectedStep: StepDto | null;
  onSelectStep: (step: StepDto) => void;
  editMode: boolean;
  isAdmin: boolean;
  showAddStep: boolean;
  onToggleAddStep: () => void;
  newStepNumber: string;
  onNewStepNumberChange: (value: string) => void;
  newStepComment: string;
  onNewStepCommentChange: (value: string) => void;
  onAddStep: () => void;
  addingStep: boolean;
  onDeleteStep: (stepId: number) => void;
}

export default function StepPanel({
  title,
  steps,
  selectedStep,
  onSelectStep,
  editMode,
  isAdmin,
  showAddStep,
  onToggleAddStep,
  newStepNumber,
  onNewStepNumberChange,
  newStepComment,
  onNewStepCommentChange,
  onAddStep,
  addingStep,
  onDeleteStep,
}: StepPanelProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2 text-white">{title}</h1>

      <h2 className="text-xl font-semibold mb-3 text-white">Шаги расстановки</h2>
      <StepSelector
        steps={steps}
        selectedStep={selectedStep}
        onSelectStep={onSelectStep}
        onDeleteStep={isAdmin && editMode ? onDeleteStep : undefined}
      />

      {isAdmin && editMode && (
        <div className="mt-3">
          <Button variant="accent" size="sm" onClick={onToggleAddStep}>
            {showAddStep ? 'Отмена' : '+ Добавить шаг'}
          </Button>
          {showAddStep && (
            <Card className="mt-2 p-3 space-y-2">
              <input
                type="number"
                placeholder="Номер шага"
                value={newStepNumber}
                onChange={e => onNewStepNumberChange(e.target.value)}
                className="w-full p-2 bg-dark-300 border border-gray-600 rounded text-white text-sm"
                min="1"
              />
              <input
                type="text"
                placeholder="Комментарий (необязательно)"
                value={newStepComment}
                onChange={e => onNewStepCommentChange(e.target.value)}
                className="w-full p-2 bg-dark-300 border border-gray-600 rounded text-white text-sm"
              />
              <Button variant="primary" size="sm" onClick={onAddStep} disabled={addingStep}>
                {addingStep ? 'Создание...' : 'Создать шаг'}
              </Button>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}