import StepSelector from './StepSelector';
import { useAuth } from '../context/AuthContext';
import type { StepDto } from '../types';

interface StepPanelProps {
  title: string;
  teamName: string;
  mapName: string;
  side: string;
  roundNumber?: number | null;
  opponentTeamName?: string | null;
  youtubeUrl?: string | null;
  description?: string | null;
  steps: StepDto[];
  selectedStep: StepDto | null;
  onSelectStep: (step: StepDto) => void;
  editMode: boolean;
  isAdmin: boolean;
  onToggleEdit: () => void;
  // step actions
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
  teamName,
  mapName,
  side,
  roundNumber,
  opponentTeamName,
  youtubeUrl,
  description,
  steps,
  selectedStep,
  onSelectStep,
  editMode,
  isAdmin,
  onToggleEdit,
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
      <div className="text-gray-400 mb-2 text-sm">
        {teamName} · {mapName} ·{' '}
        {side === 'Attack' ? 'Атака' : 'Защита'}
        {roundNumber && <span> · Раунд {roundNumber}</span>}
        {opponentTeamName && <span> · Против {opponentTeamName}</span>}
        {youtubeUrl && (
          <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-red-400 hover:text-red-300 underline">
            YouTube
          </a>
        )}
      </div>
      {description && <p className="mb-4 text-gray-300 text-sm">{description}</p>}

      <h2 className="text-xl font-semibold mb-3 text-white">Шаги расстановки</h2>
      <StepSelector
        steps={steps}
        selectedStep={selectedStep}
        onSelectStep={onSelectStep}
        onDeleteStep={isAdmin && editMode ? onDeleteStep : undefined}
      />

      {isAdmin && editMode && (
        <div className="mt-3">
          <button onClick={onToggleAddStep} className="px-3 py-1 bg-teal-500 text-white rounded hover:bg-teal-600 transition text-sm">
            {showAddStep ? 'Отмена' : '+ Добавить шаг'}
          </button>
          {showAddStep && (
            <div className="mt-2 bg-gray-800 p-3 rounded border border-gray-700 space-y-2">
              <input type="number" placeholder="Номер шага" value={newStepNumber} onChange={e => onNewStepNumberChange(e.target.value)} className="w-full p-2 bg-gray-900 border border-gray-600 rounded text-white text-sm" min="1" />
              <input type="text" placeholder="Комментарий (необязательно)" value={newStepComment} onChange={e => onNewStepCommentChange(e.target.value)} className="w-full p-2 bg-gray-900 border border-gray-600 rounded text-white text-sm" />
              <button onClick={onAddStep} disabled={addingStep} className="px-4 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50">
                {addingStep ? 'Создание...' : 'Создать шаг'}
              </button>
            </div>
          )}
        </div>
      )}

      {isAdmin && (
        <button onClick={onToggleEdit} className={`mt-4 px-4 py-2 rounded text-white transition ${editMode ? 'bg-teal-500 hover:bg-teal-600' : 'bg-teal-500 hover:bg-teal-600'}`}>
          {editMode ? 'Завершить редактирование' : '✎ Редактировать'}
        </button>
      )}
    </div>
  );
}