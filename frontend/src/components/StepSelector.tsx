import type { StepDto } from '../types';

interface StepSelectorProps {
  steps: StepDto[];
  selectedStep: StepDto | null;
  onSelectStep: (step: StepDto) => void;
}

export default function StepSelector({ steps, selectedStep, onSelectStep }: StepSelectorProps) {
  return (
    <div className="space-y-2">
      {steps.map(step => (
        <button
          key={step.id}
          onClick={() => onSelectStep(step)}
          className={`w-full text-left p-3 rounded border transition ${
            selectedStep?.id === step.id
              ? 'bg-red-500 text-white border-red-500'
              : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
          }`}
        >
          Шаг {step.stepNumber}
        </button>
      ))}
    </div>
  );
}