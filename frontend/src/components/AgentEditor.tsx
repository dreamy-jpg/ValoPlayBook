// AgentEditor.tsx (полный код)
import { useState } from 'react';
import type { PositionDto, AgentDto, AbilityDto, StepAbilityDto } from '../types';
import {
  updatePosition,
  createStepAbility,
  deleteStepAbility,
  replaceAgent,
} from '../api/defaults';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { getAbilityIconUrl } from '../utils/iconUrls';
import AgentIcon from './ui/AgentIcon';
import toast from 'react-hot-toast';

interface AgentEditPanelProps {
  position: PositionDto | null;
  allAgents: AgentDto[];
  agentAbilities: Record<number, AbilityDto[]>;
  stepAbilities: StepAbilityDto[];
  selectedStepId: number;
  attackerAgentIds: number[];
  defenderAgentIds: number[];
  creatingSlot: { side: 'attack' | 'defense' } | null;
  onClose: () => void;
  onPositionUpdated: (pos: PositionDto) => void;
  onAgentReplaced: (pos: PositionDto) => void;
  onAbilityAdded: (ability: StepAbilityDto) => void;
  onAbilityDeleted: (abilityId: number) => void;
  onAbilityUpdated?: (ability: StepAbilityDto) => void;
  onCreateAgent?: (agentId: number) => void;
}

export default function AgentEditPanel({
  position,
  allAgents,
  agentAbilities,
  stepAbilities,
  selectedStepId,
  attackerAgentIds,
  defenderAgentIds,
  creatingSlot,
  onClose,
  onPositionUpdated,
  onAgentReplaced,
  onAbilityAdded,
  onAbilityDeleted,
  onCreateAgent,
}: AgentEditPanelProps) {
  const [savingPos, setSavingPos] = useState(false);
  const [addingAbilityId, setAddingAbilityId] = useState<number | null>(null);
  const [replacingAgentId, setReplacingAgentId] = useState<number | null>(null);

  const isCreating = creatingSlot !== null;

  const agentStepAbilities = position
    ? stepAbilities.filter(sa => sa.agentId === position.agentId)
    : [];
  const abilitiesList = position ? agentAbilities[position.agentId] || [] : [];

  const usedCounts: Record<number, number> = {};
  agentStepAbilities.forEach(sa => {
    usedCounts[sa.abilityId] = (usedCounts[sa.abilityId] || 0) + 1;
  });

  const handleSavePosition = async () => {
    if (!position) return;
    setSavingPos(true);
    try {
      await updatePosition(position.id, { x: position.x, y: position.y, rotation: position.rotation });
      onPositionUpdated({ ...position });
      toast.success('Позиция сохранена');
    } catch {
      toast.error('Ошибка сохранения позиции');
    } finally {
      setSavingPos(false);
    }
  };

  const handleAddAbility = async (ability: AbilityDto) => {
    if (!position) return;
    setAddingAbilityId(ability.id);
    try {
      const created = await createStepAbility({
        abilityId: ability.id,
        agentId: position.agentId,
        activationStepId: selectedStepId,
        x: position.x,
        y: position.y,
        rotation: 0,
      });
      onAbilityAdded(created);
      toast.success(`Способность "${ability.name}" добавлена`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка добавления');
    } finally {
      setAddingAbilityId(null);
    }
  };

  const handleDeleteAbility = async (stepAbilityId: number) => {
    try {
      await deleteStepAbility(stepAbilityId);
      onAbilityDeleted(stepAbilityId);
      toast.success('Способность удалена');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка удаления');
    }
  };

  const handleReplaceAgent = async (agentId: number) => {
    if (!position) {
      onCreateAgent?.(agentId);
      return;
    }
    if (agentId === position.agentId) return;
    setReplacingAgentId(agentId);
    try {
      const updatedPos = await replaceAgent(position.id, agentId);
      onAgentReplaced(updatedPos);
      toast.success('Агент заменён');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка замены');
    } finally {
      setReplacingAgentId(null);
    }
  };

  const isAgentOccupied = (agentId: number) => {
    if (position) {
      return position.isAttacker
        ? attackerAgentIds.includes(agentId)
        : defenderAgentIds.includes(agentId);
    }
    if (creatingSlot) {
      return creatingSlot.side === 'attack'
        ? attackerAgentIds.includes(agentId)
        : defenderAgentIds.includes(agentId);
    }
    return false;
  };

  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white font-semibold">
            {isCreating ? 'Выберите агента' : 'Редактор агента'}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>

        <div className="mb-4">
          <h4 className="text-sm text-gray-400 mb-2">
            {isCreating ? 'Выберите агента для добавления' : 'Замена агента'}
          </h4>
          <div className="flex flex-wrap gap-2">
            {allAgents.map(agent => {
              const isCurrent = position?.agentId === agent.id;
              const occupied = isAgentOccupied(agent.id);
              const disabled = (isCurrent && !isCreating) || occupied || replacingAgentId !== null;
              return (
                <button
                  key={agent.id}
                  onClick={() => handleReplaceAgent(agent.id)}
                  disabled={disabled}
                  className={`relative rounded-lg transition ${
                    disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-105'
                  }`}
                  title={agent.name + (occupied && !isCurrent ? ' (занят)' : '')}
                >
                  <AgentIcon agentName={agent.name} size="nm" />
                  {isCurrent && !isCreating && (
                    <div className="absolute inset-0 ring-2 ring-primary-500 rounded-lg" />
                  )}
                  {replacingAgentId === agent.id && (
                    <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs">...</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {!isCreating && position && (
          <>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSavePosition}
              disabled={savingPos}
              className="mb-3"
            >
              {savingPos ? 'Сохранение...' : 'Сохранить позицию'}
            </Button>

            <div className="border-t border-gray-700 pt-3">
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Способности</h4>
              <div className="space-y-2">
                {abilitiesList.map(ab => {
                  const used = usedCounts[ab.id] || 0;
                  const max = ab.maxCharges;
                  const canAdd = used < max;
                  const firstInstance = agentStepAbilities.find(sa => sa.abilityId === ab.id);

                  return (
                    <div key={ab.id} className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <img
                          src={getAbilityIconUrl(position.agentName, ab.name)}
                          alt={ab.name}
                          className="w-8 h-8"
                        />
                        <div className="flex-1 text-sm text-gray-300">{ab.name}</div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="accent"
                            size="sm"
                            onClick={() => handleAddAbility(ab)}
                            disabled={!canAdd || addingAbilityId === ab.id}
                            className="px-2 py-1 text-xs"
                          >
                            +
                          </Button>
                          {firstInstance && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteAbility(firstInstance.id)}
                              className="px-2 py-1 text-xs"
                            >
                              −
                            </Button>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">{used}/{max}</span>
                        {!canAdd && <span className="text-xs text-danger-500 ml-1">лимит</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}