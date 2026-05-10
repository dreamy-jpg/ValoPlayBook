// TacticMapPage.tsx (полный код)
import toast from 'react-hot-toast';
import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  updatePosition,
  updateStepAbility,
  updateStepComment,
  fetchAgents,
} from '../api/defaults';
import { useDefaultData } from '../hooks/useDefaultData';
import { useStepActions } from '../hooks/useStepActions';
import { useAgentActions } from '../hooks/useAgentActions';
import { useAbilityActions } from '../hooks/useAbilityActions';
import type {
  StepDto,
  PositionDto,
  StepAbilityDto,
  AgentDto,
  AbilityDto,
} from '../types';
import StepPanel from '../components/StepPanel';
import CanvasMap from '../components/CanvasMap';
import RightPanel from '../components/RightPanel';
import AgentSlots from '../components/AgentSlots';
import AbilityOverlay from '../components/AbilityOverlay';
import { Button } from '../components/ui/Button';
import { Panel } from '../components/ui/Panel';
import { useAuth } from '../context/AuthContext';

interface AgentInfo {
  id: number;
  name: string;
}

export default function TacticMapPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { defaultData, loading, error, updateStepData, reload } = useDefaultData(id);
  const [selectedStep, setSelectedStep] = useState<StepDto | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [agents, setAgents] = useState<AgentDto[]>([]);
  const [editingAgent, setEditingAgent] = useState<PositionDto | null>(null);
  const { user, isLoading: authLoading } = useAuth();

  const isAdmin = user?.role === 'Admin';

  const canEdit = useMemo(() => {
    if (!user) return false;
    if (isAdmin) return true;
    return defaultData?.createdByUserId === user.id;
  }, [user, isAdmin, defaultData?.createdByUserId]);

  useEffect(() => {
    if (authLoading) return;
    if (loading) return;
    if (!defaultData) return;
    if (!canEdit) {
      toast.error('У вас нет прав на редактирование');
      navigate(`/defaults/${id}`);
    }
  }, [authLoading, loading, defaultData, canEdit, navigate, id]);

  useEffect(() => {
    fetchAgents()
      .then(setAgents)
      .catch(err => console.error('Ошибка загрузки агентов:', err));
  }, []);

  const agentAbilitiesMap = useMemo(() => {
    const map: Record<number, AbilityDto[]> = {};
    for (const agent of agents) {
      map[agent.id] = agent.abilities;
    }
    return map;
  }, [agents]);

  useEffect(() => {
    if (defaultData && defaultData.steps.length > 0 && !selectedStep) {
      setSelectedStep(defaultData.steps[0]);
    }
  }, [defaultData, selectedStep]);

  const activeAbilities = useMemo(() => {
    if (!selectedStep || !defaultData) return [];
    const currentStepNumber = selectedStep.stepNumber;
    return defaultData.steps
      .flatMap(step => step.abilities)
      .filter(sa => {
        const activationStep = defaultData.steps.find(
          s => s.id === sa.activationStepId
        );
        if (!activationStep) return false;
        const activationStepNumber = activationStep.stepNumber;
        return (
          currentStepNumber >= activationStepNumber &&
          currentStepNumber < activationStepNumber + sa.durationSteps
        );
      });
  }, [selectedStep, defaultData]);

  const attackerAgentIds = useMemo(() => {
    if (!selectedStep) return [];
    return selectedStep.positions.filter(p => p.isAttacker).map(p => p.agentId);
  }, [selectedStep]);

  const defenderAgentIds = useMemo(() => {
    if (!selectedStep) return [];
    return selectedStep.positions.filter(p => !p.isAttacker).map(p => p.agentId);
  }, [selectedStep]);

  const attackAgents = useMemo<AgentInfo[]>(() => {
    if (!selectedStep) return [];
    return selectedStep.positions
      .filter(p => p.isAttacker)
      .map(p => ({ id: p.agentId, name: p.agentName }));
  }, [selectedStep]);

  const defenseAgents = useMemo<AgentInfo[]>(() => {
    if (!selectedStep) return [];
    return selectedStep.positions
      .filter(p => !p.isAttacker)
      .map(p => ({ id: p.agentId, name: p.agentName }));
  }, [selectedStep]);

  const stepActions = useStepActions({
    id,
    reload,
    selectedStepId: selectedStep?.id ?? null,
    onStepDeleted: (stepId) => {
      if (selectedStep?.id === stepId) setSelectedStep(null);
    },
  });

  const agentActions = useAgentActions({
    id,
    selectedStep,
    updateStepData,
    setSelectedStep,
    editingAgent,
    setEditingAgent,
  });

  const abilityActions = useAbilityActions({
    selectedStep,
    updateStepData,
    setSelectedStep,
  });

  const handlePositionUpdated = (updatedPos: PositionDto) => {
    if (!selectedStep) return;
    updateStepData(selectedStep.id, step => ({
      ...step,
      positions: step.positions.map(p =>
        p.id === updatedPos.id ? updatedPos : p
      ),
    }));
    setSelectedStep(prev =>
      prev
        ? { ...prev, positions: prev.positions.map(p => (p.id === updatedPos.id ? updatedPos : p)) }
        : null
    );
  };

  const handleAbilityUpdated = (updatedAbility: StepAbilityDto) => {
    if (!selectedStep) return;
    updateStepData(selectedStep.id, step => ({
      ...step,
      abilities: step.abilities.map(a =>
        a.id === updatedAbility.id ? updatedAbility : a
      ),
    }));
    setSelectedStep(prev =>
      prev
        ? { ...prev, abilities: prev.abilities.map(a => (a.id === updatedAbility.id ? updatedAbility : a)) }
        : null
    );
  };

  const handleDragPositionChange = async (positionId: number, newX: number, newY: number) => {
    const position = selectedStep?.positions.find(p => p.id === positionId);
    if (!position) return;
    const updatedPos = { ...position, x: newX, y: newY };
    handlePositionUpdated(updatedPos);
    try {
      await updatePosition(positionId, { x: newX, y: newY, rotation: position.rotation });
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
      });
    } catch {
      toast.error('Ошибка сохранения способности');
      handleAbilityUpdated(ability);
    }
  };

  const handleCommentUpdate = async (stepId: number, newComment: string) => {
    if (!selectedStep || !defaultData) return;
    // Локальное обновление
    updateStepData(stepId, step => ({ ...step, comment: newComment }));
    setSelectedStep(prev =>
      prev ? { ...prev, comment: newComment } : null
    );
    try {
      await updateStepComment(defaultData.id, stepId, newComment);
      toast.success('Комментарий обновлён');
    } catch {
      toast.error('Не удалось сохранить комментарий');
      // Откат при ошибке
      updateStepData(stepId, step => ({ ...step, comment: selectedStep.comment }));
      setSelectedStep(prev =>
        prev ? { ...prev, comment: selectedStep.comment } : null
      );
    }
  };

  if (loading) return <div className="p-4 text-white">Загрузка дефолта...</div>;
  if (error) return <div className="p-4 text-danger-500">Ошибка: {error}</div>;
  if (!defaultData) return <div className="p-4 text-white">Дефолт не найден</div>;

  const showEditor = (editingAgent || agentActions.creatingSlot) && editMode;

  const handleToggleEdit = () => {
    setEditMode(!editMode);
    if (editMode) {
      stepActions.setShowAddStep(false);
      setEditingAgent(null);
      agentActions.setCreatingSlot(null);
    }
  };

  return (
    <div className="relative w-full h-full bg-dark-300 overflow-hidden">
      <div className="absolute inset-0">
        <CanvasMap
          mapName={defaultData.map.name}
          side={defaultData.side as 'Attack' | 'Defense'}
          positions={selectedStep?.positions || []}
          abilities={activeAbilities}
          agentAbilities={agentAbilitiesMap}
          editMode={editMode}
          onPositionChange={handleDragPositionChange}
          onAbilityChange={handleDragAbilityChange}
        />
        {!editMode && (
          <AbilityOverlay
            attackAgents={attackAgents}
            defenseAgents={defenseAgents}
            stepAbilities={activeAbilities}
            agentAbilities={agentAbilitiesMap}
          />
        )}
      </div>

      <Panel className="fixed left-4 top-20 z-10 w-80 max-h-[calc(100vh-6rem)] overflow-y-auto">
        <StepPanel
          title={defaultData.title}
          steps={defaultData.steps}
          selectedStep={selectedStep}
          onSelectStep={setSelectedStep}
          editMode={editMode}
          isAdmin={isAdmin}
          showAddStep={stepActions.showAddStep}
          onToggleAddStep={() => stepActions.setShowAddStep(!stepActions.showAddStep)}
          newStepNumber={stepActions.newStepNumber}
          onNewStepNumberChange={stepActions.setNewStepNumber}
          newStepComment={stepActions.newStepComment}
          onNewStepCommentChange={stepActions.setNewStepComment}
          onAddStep={stepActions.handleAddStep}
          addingStep={stepActions.addingStep}
          onDeleteStep={stepActions.handleDeleteStep}
        />
      </Panel>

      <Panel className="fixed right-4 top-20 z-10 w-80 max-h-[calc(100vh-6rem)] overflow-y-auto">
        <RightPanel
          stepNumber={selectedStep?.stepNumber}
          comment={selectedStep?.comment}
          showEditor={showEditor}
          editingAgent={editingAgent}
          agents={agents}
          agentAbilities={agentAbilitiesMap}
          stepAbilities={selectedStep?.abilities || []}
          selectedStepId={selectedStep?.id || 0}
          attackerAgentIds={attackerAgentIds}
          defenderAgentIds={defenderAgentIds}
          creatingSlot={agentActions.creatingSlot}
          editMode={editMode}
          isAdmin={isAdmin}
          defaultId={parseInt(id || '0', 10)}
          onClose={() => {
            setEditingAgent(null);
            agentActions.setCreatingSlot(null);
          }}
          onPositionUpdated={handlePositionUpdated}
          onAgentReplaced={agentActions.handleAgentReplaced}
          onAbilityAdded={abilityActions.handleAbilityAdded}
          onAbilityDeleted={abilityActions.handleAbilityDeleted}
          onAbilityUpdated={handleAbilityUpdated}
          onCreateAgent={agentActions.handleCreateAgent}
          onCommentUpdate={handleCommentUpdate}
        />
      </Panel>

      {editMode && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-10">
          <AgentSlots
            attackAgents={selectedStep?.positions?.filter(p => p.isAttacker) ?? []}
            defenseAgents={selectedStep?.positions?.filter(p => !p.isAttacker) ?? []}
            onSelectSlot={(side, index) => {
              const agent = side === 'attack' 
                ? (selectedStep?.positions?.filter(p => p.isAttacker) ?? [])[index]
                : (selectedStep?.positions?.filter(p => !p.isAttacker) ?? [])[index];
              if (agent) {
                agentActions.handleSelectAgent(agent);
              } else {
                agentActions.setCreatingSlot({ side, index });
              }
            }}
            selectedAgentId={editingAgent?.agentId || null}
            editMode={editMode}
          />
        </div>
      )}

      {canEdit && (
        <Button
          variant={editMode ? 'danger' : 'accent'}
          size="lg"
          className="fixed left-[calc(1rem+320px+1rem)] top-20 z-20 rounded-full shadow-lg"
          onClick={handleToggleEdit}
        >
          {editMode ? 'Выйти из редактирования' : 'Редактировать'}
        </Button>
      )}
    </div>
  );
}