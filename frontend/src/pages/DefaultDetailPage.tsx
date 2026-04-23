import toast from 'react-hot-toast';
import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { updatePosition, updateStepAbility } from '../api/defaults';
import { useDefaultData } from '../hooks/useDefaultData';
import type { StepDto, PositionDto, StepAbilityDto } from '../types';
import StepSelector from '../components/StepSelector';
import EditorsPanel from '../components/EditorsPanel';
import MapPanel from '../components/MapPanel';
import CommentSection from '../components/CommentSection';
import { useAuth } from '../context/AuthContext';

export default function DefaultDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { defaultData, loading, error, updateStepData } = useDefaultData(id);
  const [selectedStep, setSelectedStep] = useState<StepDto | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (defaultData && defaultData.steps.length > 0 && !selectedStep) {
      setSelectedStep(defaultData.steps[0]);
    }
  }, [defaultData, selectedStep]);

  const activeAbilities = useMemo(() => {
    if (!selectedStep || !defaultData) return [];
    const currentStepNumber = selectedStep.stepNumber;
    return defaultData.steps.flatMap(step => step.abilities).filter(sa => {
      const activationStep = defaultData.steps.find(s => s.id === sa.activationStepId);
      if (!activationStep) return false;
      const activationStepNumber = activationStep.stepNumber;
      return (
        currentStepNumber >= activationStepNumber &&
        currentStepNumber < activationStepNumber + sa.durationSteps
      );
    });
  }, [selectedStep, defaultData]);

  const handlePositionUpdated = (updatedPos: PositionDto) => {
    if (!selectedStep) return;
    updateStepData(selectedStep.id, step => ({
      ...step,
      positions: step.positions.map(p => p.id === updatedPos.id ? updatedPos : p)
    }));
    setSelectedStep(prev => prev ? { ...prev, positions: prev.positions.map(p => p.id === updatedPos.id ? updatedPos : p) } : null);
  };

  const handleAbilityUpdated = (updatedAbility: StepAbilityDto) => {
    if (!selectedStep) return;
    updateStepData(selectedStep.id, step => ({
      ...step,
      abilities: step.abilities.map(a => a.id === updatedAbility.id ? updatedAbility : a)
    }));
    setSelectedStep(prev => prev ? { ...prev, abilities: prev.abilities.map(a => a.id === updatedAbility.id ? updatedAbility : a) } : null);
  };

  const handleDragPositionChange = async (positionId: number, newX: number, newY: number) => {
    const position = selectedStep?.positions.find(p => p.id === positionId);
    if (!position) return;
    const updatedPos = { ...position, x: newX, y: newY };
    handlePositionUpdated(updatedPos);
    try {
      await updatePosition(positionId, { x: newX, y: newY, rotation: position.rotation });
      toast.success('Позиция сохранена');
    } catch {
      toast.error('Ошибка сохранения позиции');
      handlePositionUpdated(position);
    }
  };

  const handleDragAbilityChange = async (abilityId: number, newX: number, newY: number) => {
    const ability = selectedStep?.abilities.find(a => a.id === abilityId);
    if (!ability) return;
    const updatedAbility = { ...ability, x: newX, y: newY };
    handleAbilityUpdated(updatedAbility);
    try {
      await updateStepAbility(abilityId, {
        x: newX,
        y: newY,
        rotation: ability.rotation,
        radius: ability.radius,
        length: ability.length,
        width: ability.width,
        angle: ability.angle,
        durationSteps: ability.durationSteps,
        zoneType: ability.zoneType,
      });
      toast.success('Способность сохранена');
    } catch {
      toast.error('Ошибка сохранения способности');
      handleAbilityUpdated(ability);
    }
  };

  if (loading) return <div className="p-4 text-white">Загрузка дефолта...</div>;
  if (error) return <div className="p-4 text-red-400">Ошибка: {error}</div>;
  if (!defaultData) return <div className="p-4 text-white">Дефолт не найден</div>;

  const viewBox = { width: 1024, height: 1024 };
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';

  return (
    <div className="px-4 sm:px-6 lg:px-16 py-4">
      <div className="grid grid-cols-1 md:grid-cols-[minmax(260px,1fr)_2fr_minmax(260px,1fr)] gap-4 md:gap-6 lg:gap-8">
        {/* Левая колонка */}
        <div>
          <h1 className="text-2xl font-bold mb-2 text-white">{defaultData.title}</h1>
          <div className="text-gray-400 mb-2 text-sm">
            {defaultData.team.name} · {defaultData.map.name} · {defaultData.side === 'Attack' ? 'Атака' : 'Защита'}
            {defaultData.roundNumber && <span> · Раунд {defaultData.roundNumber}</span>}
            {defaultData.opponentTeamName && <span> · Против {defaultData.opponentTeamName}</span>}
            {defaultData.youtubeUrl && (
              <a href={defaultData.youtubeUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-red-400 hover:text-red-300 underline">
                YouTube
              </a>
            )}
          </div>
          {defaultData.description && <p className="mb-4 text-gray-300 text-sm">{defaultData.description}</p>}

          <h2 className="text-xl font-semibold mb-3 text-white">Шаги расстановки</h2>
          <StepSelector
            steps={defaultData.steps}
            selectedStep={selectedStep}
            onSelectStep={setSelectedStep}
          />

          {isAdmin && (
            <button
              onClick={() => setEditMode(!editMode)}
              className={`mt-4 px-4 py-2 rounded text-white transition ${
                editMode ? 'bg-teal-500 hover:bg-teal-600' : 'bg-teal-500 hover:bg-teal-600'
              }`}
            >
              {editMode ? 'Завершить редактирование' : '✎ Редактировать'}
            </button>
          )}

          {selectedStep && (
            <EditorsPanel
              editMode={editMode}
              positions={selectedStep.positions}
              abilities={selectedStep.abilities}
              onPositionUpdated={handlePositionUpdated}
              onAbilityUpdated={handleAbilityUpdated}
            />
          )}
        </div>

        {/* Центральная колонка: карта */}
        <div className="w-full max-w-3xl xl:max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-3 text-white">Позиции агентов (шаг {selectedStep?.stepNumber})</h2>
          {selectedStep && (
            <MapPanel
              mapName={defaultData.map.name}
              positions={selectedStep.positions}
              side={defaultData.side as 'Attack' | 'Defense'}
              viewBoxWidth={viewBox.width}
              viewBoxHeight={viewBox.height}
              abilities={activeAbilities}
              editMode={editMode}
              onPositionChange={handleDragPositionChange}
              onAbilityChange={handleDragAbilityChange}
            />
          )}
        </div>

        {/* Правая колонка: комментарий к шагу */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-white">
            Комментарий к шагу {selectedStep?.stepNumber}
          </h2>
          <div className="bg-gray-800 p-4 rounded border border-gray-700">
            <p className="text-gray-300">{selectedStep?.comment || 'Нет комментария'}</p>
          </div>
        </div>
      </div>
      <CommentSection defaultId={defaultData.id} />
    </div>
  );
}