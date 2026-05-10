// StepSelector.tsx (полный код)
import type { StepDto } from '../types';
import { Button } from './ui/Button';

interface StepSelectorProps {
  steps: StepDto[];
  selectedStep: StepDto | null;
  onSelectStep: (step: StepDto) => void;
  onDeleteStep?: (stepId: number) => void;
}

export default function StepSelector({ steps, selectedStep, onSelectStep, onDeleteStep }: StepSelectorProps) {
  return (
    <div className="space-y-2">
      {steps.map(step => (
        <div key={step.id} className="flex items-center gap-2">
          <Button
            variant={selectedStep?.id === step.id ? 'danger' : 'secondary'}
            size="sm"
            fullWidth
            className="justify-start"
            onClick={() => onSelectStep(step)}
          >
            Шаг {step.stepNumber}
          </Button>
          {onDeleteStep && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Удалить шаг ${step.stepNumber}?`)) onDeleteStep(step.id);
              }}
              title="Удалить шаг"
            >
              🗑️
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}