import type { StepDto } from '../types';

interface StepSelectorProps {
  steps: StepDto[];
  selectedStep: StepDto | null;
  onSelectStep: (step: StepDto) => void;
  onDeleteStep?: (stepId: number) => void;   // новый пропс
}

export default function StepSelector({ steps, selectedStep, onSelectStep, onDeleteStep }: StepSelectorProps) {
  return (
    <div className="space-y-2">
      {steps.map(step => (
        <div key={step.id} className="flex items-center gap-2">
          <button
            onClick={() => onSelectStep(step)}
            className={`flex-1 text-left p-3 rounded border transition ${
              selectedStep?.id === step.id
                ? 'bg-red-500 text-white border-red-500'
                : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
            }`}
          >
            Шаг {step.stepNumber}
          </button>
          {onDeleteStep && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Удалить шаг ${step.stepNumber}?`)) onDeleteStep(step.id);
              }}
              className="text-red-400 hover:text-red-300 p-2"
              title="Удалить шаг"
            >
              🗑️
            </button>
          )}
        </div>
      ))}
    </div>
  );
}