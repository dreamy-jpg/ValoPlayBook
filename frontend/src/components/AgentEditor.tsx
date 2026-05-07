import { useState } from 'react';
import type { PositionDto, AgentDto, AbilityDto, StepAbilityDto } from '../types';
import {
  updatePosition,
  createStepAbility,
  deleteStepAbility,
  replaceAgent,
  updateStepAbility,
} from '../api/defaults';
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
  onAbilityUpdated: (ability: StepAbilityDto) => void;
  onCreateAgent?: (agentId: number) => void;
}

function getAgentIconUrl(agentName: string): string {
  return `/agents/${agentName.toLowerCase()}/agent${agentName}.png`;
}

function getAbilityIconUrl(agentName: string, abilityName: string): string {
  return `/agents/${agentName.toLowerCase()}/abilities/${abilityName.replace(/\s+/g, '_')}.png`;
}

const zoneTypes = [
  { value: 'Circle', label: 'Круг' },
  { value: 'Line', label: 'Линия' },
  { value: 'Rectangle', label: 'Прямоугольник' },
  { value: 'Cone', label: 'Конус' },
];

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
  onAbilityUpdated,
  onCreateAgent,
}: AgentEditPanelProps) {
  const [savingPos, setSavingPos] = useState(false);
  const [addingAbilityId, setAddingAbilityId] = useState<number | null>(null);
  const [replacingAgentId, setReplacingAgentId] = useState<number | null>(null);

  const [editingAbilityId, setEditingAbilityId] = useState<number | null>(null);
  const [savingZone, setSavingZone] = useState(false);
  const [zoneForm, setZoneForm] = useState({
    zoneType: 'Circle' as StepAbilityDto['zoneType'],
    radius: 30,
    length: 80,
    width: 10,
    angle: 60,
    durationSteps: 1,
    rotation: 0,
  });

  const isCreating = creatingSlot !== null;

  const agentStepAbilities = position
    ? stepAbilities.filter(sa => sa.agentId === position.agentId)
    : [];
  const abilitiesList = position ? agentAbilities[position.agentId] || [] : [];

  const usedCounts: Record<number, number> = {};
  agentStepAbilities.forEach(sa => {
    usedCounts[sa.abilityId] = (usedCounts[sa.abilityId] || 0) + 1;
  });

  const startEditZone = (ab: StepAbilityDto) => {
    setEditingAbilityId(ab.id);
    setZoneForm({
      zoneType: ab.zoneType || 'Circle',
      radius: ab.radius ?? 30,
      length: ab.length ?? 80,
      width: ab.width ?? 10,
      angle: ab.angle ?? 60,
      durationSteps: ab.durationSteps ?? 1,
      rotation: ab.rotation ?? 0,
    });
  };

  const cancelEditZone = () => {
    setEditingAbilityId(null);
  };

  // keepOpen = true -> не закрываем редактор после сохранения
  const saveZoneEdit = async (keepOpen = false) => {
    if (editingAbilityId === null || savingZone) return;
    setSavingZone(true);
    try {
      const updateData: any = {
        x: 512,
        y: 512,
        rotation: zoneForm.rotation,
        zoneType: zoneForm.zoneType,
        durationSteps: zoneForm.durationSteps,
      };
      switch (zoneForm.zoneType) {
        case 'Circle':
          updateData.radius = zoneForm.radius;
          break;
        case 'Line':
          updateData.length = zoneForm.length;
          updateData.width = zoneForm.width;
          break;
        case 'Rectangle':
          updateData.length = zoneForm.length;
          updateData.width = zoneForm.width;
          break;
        case 'Cone':
          updateData.length = zoneForm.length;
          updateData.angle = zoneForm.angle;
          break;
      }

      await updateStepAbility(editingAbilityId, updateData);

      const updatedAbility = agentStepAbilities.find(sa => sa.id === editingAbilityId);
      if (updatedAbility) {
        onAbilityUpdated({
          ...updatedAbility,
          zoneType: zoneForm.zoneType,
          radius: zoneForm.zoneType === 'Circle' ? zoneForm.radius : null,
          length: (zoneForm.zoneType === 'Line' || zoneForm.zoneType === 'Rectangle' || zoneForm.zoneType === 'Cone') ? zoneForm.length : null,
          width: (zoneForm.zoneType === 'Line' || zoneForm.zoneType === 'Rectangle') ? zoneForm.width : null,
          angle: zoneForm.zoneType === 'Cone' ? zoneForm.angle : null,
          durationSteps: zoneForm.durationSteps,
          rotation: zoneForm.rotation,
        });
      }
      toast.success('Зона обновлена');
      if (!keepOpen) {
        setEditingAbilityId(null);
      }
    } catch (err) {
      toast.error('Ошибка сохранения зоны');
      // при ошибке не закрываем редактор
    } finally {
      setSavingZone(false);
    }
  };

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
        x: 512,
        y: 512,
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
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mt-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white font-semibold">
          {isCreating ? 'Выберите агента' : 'Редактор агента'}
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
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
                className={`relative w-10 h-10 rounded border-2 transition ${
                  isCurrent && !isCreating ? 'border-teal-500' : 'border-gray-600 hover:border-teal-400'
                } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                title={agent.name + (occupied && !isCurrent ? ' (занят)' : '')}
              >
                <img
                  src={getAgentIconUrl(agent.name)}
                  alt={agent.name}
                  className="w-full h-full rounded"
                />
                {replacingAgentId === agent.id && (
                  <div className="absolute inset-0 bg-black/60 rounded flex items-center justify-center">
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
          <button onClick={handleSavePosition} disabled={savingPos} className="bg-teal-600 text-white px-3 py-1 rounded text-sm hover:bg-teal-700 disabled:opacity-50 mb-3">
            {savingPos ? 'Сохранение...' : 'Сохранить позицию'}
          </button>

          <div className="border-t border-gray-700 pt-3">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Способности</h4>
            <div className="space-y-2">
              {abilitiesList.map(ab => {
                const used = usedCounts[ab.id] || 0;
                const max = ab.maxCharges;
                const canAdd = used < max;
                const instances = agentStepAbilities.filter(sa => sa.abilityId === ab.id);
                const firstInstance = instances[0];
                const isEditingZone = editingAbilityId === firstInstance?.id;

                return (
                  <div key={ab.id} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <img src={getAbilityIconUrl(position.agentName, ab.name)} alt={ab.name} className="w-8 h-8" />
                      <div className="flex-1 text-sm text-gray-300">{ab.name}</div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleAddAbility(ab)}
                          disabled={!canAdd || addingAbilityId === ab.id}
                          className="px-2 py-1 bg-teal-600 text-white rounded text-xs hover:bg-teal-700 disabled:opacity-50"
                        >
                          +
                        </button>
                        {instances.length > 0 && (
                          <>
                            <button
                              onClick={() => handleDeleteAbility(firstInstance.id)}
                              className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                            >
                              −
                            </button>
                            <button
                              onClick={() => startEditZone(firstInstance)}
                              className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                            >
                              ✎
                            </button>
                          </>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">{used}/{max}</span>
                      {!canAdd && <span className="text-xs text-red-400 ml-1">лимит</span>}
                    </div>
                    {isEditingZone && firstInstance && (
                      <div className="ml-10 p-2 bg-gray-900 rounded border border-gray-700 space-y-2">
                        <div>
                          <label className="text-xs text-gray-400">Тип зоны</label>
                          <select
                            value={zoneForm.zoneType}
                            onChange={e => setZoneForm({ ...zoneForm, zoneType: e.target.value as any })}
                            className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                          >
                            {zoneTypes.map(zt => (
                              <option key={zt.value} value={zt.value}>{zt.label}</option>
                            ))}
                          </select>
                        </div>
                        {zoneForm.zoneType === 'Circle' && (
                          <div>
                            <label className="text-xs text-gray-400">Радиус</label>
                            <input
                              type="number"
                              value={zoneForm.radius}
                              onChange={e => setZoneForm({ ...zoneForm, radius: parseFloat(e.target.value) })}
                              onKeyDown={(e) => e.key === 'Enter' && saveZoneEdit(true)}
                              className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                            />
                          </div>
                        )}
                        {zoneForm.zoneType === 'Line' && (
                          <>
                            <div>
                              <label className="text-xs text-gray-400">Длина</label>
                              <input
                                type="number"
                                value={zoneForm.length}
                                onChange={e => setZoneForm({ ...zoneForm, length: parseFloat(e.target.value) })}
                                onKeyDown={(e) => e.key === 'Enter' && saveZoneEdit(true)}
                                className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-400">Толщина</label>
                              <input
                                type="number"
                                value={zoneForm.width}
                                onChange={e => setZoneForm({ ...zoneForm, width: parseFloat(e.target.value) })}
                                onKeyDown={(e) => e.key === 'Enter' && saveZoneEdit(true)}
                                className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                              />
                            </div>
                          </>
                        )}
                        {zoneForm.zoneType === 'Rectangle' && (
                          <>
                            <div>
                              <label className="text-xs text-gray-400">Ширина</label>
                              <input
                                type="number"
                                value={zoneForm.width}
                                onChange={e => setZoneForm({ ...zoneForm, width: parseFloat(e.target.value) })}
                                onKeyDown={(e) => e.key === 'Enter' && saveZoneEdit(true)}
                                className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-400">Высота</label>
                              <input
                                type="number"
                                value={zoneForm.length}
                                onChange={e => setZoneForm({ ...zoneForm, length: parseFloat(e.target.value) })}
                                onKeyDown={(e) => e.key === 'Enter' && saveZoneEdit(true)}
                                className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                              />
                            </div>
                          </>
                        )}
                        {zoneForm.zoneType === 'Cone' && (
                          <>
                            <div>
                              <label className="text-xs text-gray-400">Длина</label>
                              <input
                                type="number"
                                value={zoneForm.length}
                                onChange={e => setZoneForm({ ...zoneForm, length: parseFloat(e.target.value) })}
                                onKeyDown={(e) => e.key === 'Enter' && saveZoneEdit(true)}
                                className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-400">Угол (град.)</label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="range"
                                  min="1"
                                  max="180"
                                  value={zoneForm.angle}
                                  onChange={e => setZoneForm({ ...zoneForm, angle: parseInt(e.target.value) })}
                                  onMouseUp={() => saveZoneEdit(true)}
                                  onTouchEnd={() => saveZoneEdit(true)}
                                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                />
                                <span className="text-white text-xs w-10 text-right">{zoneForm.angle}°</span>
                              </div>
                            </div>
                          </>
                        )}
                        <div>
                          <label className="text-xs text-gray-400">Поворот (град.)</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min="-180"
                              max="180"
                              step="1"
                              value={zoneForm.rotation}
                              onChange={e => setZoneForm({ ...zoneForm, rotation: parseInt(e.target.value) })}
                              onMouseUp={() => saveZoneEdit(true)}
                              onTouchEnd={() => saveZoneEdit(true)}
                              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-white text-xs w-12 text-right">{zoneForm.rotation}°</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400">Длительность (шагов)</label>
                          <input
                            type="number"
                            value={zoneForm.durationSteps}
                            onChange={e => setZoneForm({ ...zoneForm, durationSteps: parseInt(e.target.value) })}
                            onKeyDown={(e) => e.key === 'Enter' && saveZoneEdit(true)}
                            className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                            min={1}
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => saveZoneEdit(false)}
                            disabled={savingZone}
                            className="px-3 py-1 bg-teal-600 text-white rounded text-sm hover:bg-teal-700 disabled:opacity-50"
                          >
                            {savingZone ? 'Сохранение...' : 'Сохранить и закрыть'}
                          </button>
                          <button
                            onClick={cancelEditZone}
                            disabled={savingZone}
                            className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-500 disabled:opacity-50"
                          >
                            Отмена
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}