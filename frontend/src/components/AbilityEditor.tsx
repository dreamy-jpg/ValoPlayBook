import { useState } from 'react';
import toast from 'react-hot-toast';
import type { StepAbilityDto } from '../types';
import { updateStepAbility } from '../api/defaults';

interface AbilityEditorProps {
  abilities: StepAbilityDto[];
  onAbilityUpdated: (updated: StepAbilityDto) => void;
  disabled?: boolean;
}

const zoneTypes = [
  { value: 'Circle', label: 'Круг' },
  { value: 'Line', label: 'Линия' },
  { value: 'Rectangle', label: 'Прямоугольник' },
  { value: 'Cone', label: 'Конус' },
];

export default function AbilityEditor({ abilities, onAbilityUpdated, disabled }: AbilityEditorProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    x: 0,
    y: 0,
    rotation: 0,
    zoneType: 'Circle' as StepAbilityDto['zoneType'],
    radius: 0,
    length: 0,
    width: 0,
    angle: 30,
    durationSteps: 1,
  });
  const [saving, setSaving] = useState(false);

  const startEdit = (ab: StepAbilityDto) => {
    setEditingId(ab.id);
    setFormData({
      x: ab.x ?? 0,
      y: ab.y ?? 0,
      rotation: ab.rotation ?? 0,
      zoneType: ab.zoneType || 'Circle',
      radius: ab.radius ?? 0,
      length: ab.length ?? 0,
      width: ab.width ?? 0,
      angle: ab.angle ?? 30,
      durationSteps: ab.durationSteps,
    });
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async () => {
    if (editingId === null || saving) return;
    setSaving(true);

    try {
      const updateData: any = {
        x: formData.x,
        y: formData.y,
        rotation: formData.rotation || null,
        zoneType: formData.zoneType,
        durationSteps: formData.durationSteps,
      };

      switch (formData.zoneType) {
        case 'Circle':
          updateData.radius = formData.radius;
          break;
        case 'Line':
          updateData.length = formData.length;
          updateData.width = formData.width;
          break;
        case 'Rectangle':
          updateData.length = formData.length;
          updateData.width = formData.width;
          break;
        case 'Cone':
          updateData.length = formData.length;
          updateData.angle = formData.angle;
          break;
      }

      await updateStepAbility(editingId, updateData);

      const updatedAbility = abilities.find(a => a.id === editingId);
      if (updatedAbility) {
        onAbilityUpdated({
          ...updatedAbility,
          x: formData.x,
          y: formData.y,
          rotation: formData.rotation || null,
          zoneType: formData.zoneType,
          radius: formData.zoneType === 'Circle' ? formData.radius : null,
          length: (formData.zoneType === 'Line' || formData.zoneType === 'Rectangle' || formData.zoneType === 'Cone') ? formData.length : null,
          width: (formData.zoneType === 'Line' || formData.zoneType === 'Rectangle') ? formData.width : null,
          angle: formData.zoneType === 'Cone' ? formData.angle : null,
          durationSteps: formData.durationSteps,
        });
      }
      setEditingId(null);
      toast.success('Способность обновлена');
    } catch (err) {
      toast.error('Ошибка сохранения способности');
    } finally {
      setSaving(false);
    }
  };

  if (disabled) return null;

  return (
    <div className="mt-4 p-3 bg-gray-800 rounded border border-gray-700">
      <h3 className="font-semibold mb-2 text-white">Редактор способностей</h3>
      <div className="space-y-3">
        {abilities.map(ab => (
          <div key={ab.id} className="text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium text-white truncate">
                {ab.abilityName} <span className="text-gray-400">({ab.agentName})</span>
              </span>
              {editingId !== ab.id && (
                <button
                  onClick={() => startEdit(ab)}
                  className="px-2 py-1 bg-teal-500 text-white rounded text-xs hover:bg-teal-600 transition disabled:opacity-50"
                  disabled={saving}
                >
                  Изменить
                </button>
              )}
            </div>

            {editingId === ab.id ? (
              <div className="mt-2 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-400">X</label>
                    <input
                      type="number"
                      value={formData.x}
                      onChange={e => setFormData({ ...formData, x: parseFloat(e.target.value) })}
                      className="w-full px-2 py-1 bg-gray-900 border border-gray-600 rounded text-white text-sm focus:ring-red-500 focus:border-red-500"
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400">Y</label>
                    <input
                      type="number"
                      value={formData.y}
                      onChange={e => setFormData({ ...formData, y: parseFloat(e.target.value) })}
                      className="w-full px-2 py-1 bg-gray-900 border border-gray-600 rounded text-white text-sm focus:ring-red-500 focus:border-red-500"
                      disabled={saving}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400">Поворот (град.)</label>
                  <input
                    type="number"
                    value={formData.rotation}
                    onChange={e => setFormData({ ...formData, rotation: parseFloat(e.target.value) })}
                    className="w-full px-2 py-1 bg-gray-900 border border-gray-600 rounded text-white text-sm focus:ring-red-500 focus:border-red-500"
                    disabled={saving}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400">Тип зоны</label>
                  <select
                    value={formData.zoneType}
                    onChange={e => setFormData({ ...formData, zoneType: e.target.value as any })}
                    className="w-full px-2 py-1 bg-gray-900 border border-gray-600 rounded text-white text-sm focus:ring-red-500 focus:border-red-500"
                    disabled={saving}
                  >
                    {zoneTypes.map(zt => (
                      <option key={zt.value} value={zt.value}>{zt.label}</option>
                    ))}
                  </select>
                </div>
                {formData.zoneType === 'Circle' && (
                  <div>
                    <label className="block text-xs text-gray-400">Радиус</label>
                    <input
                      type="number"
                      value={formData.radius}
                      onChange={e => setFormData({ ...formData, radius: parseFloat(e.target.value) })}
                      className="w-full px-2 py-1 bg-gray-900 border border-gray-600 rounded text-white text-sm focus:ring-red-500 focus:border-red-500"
                      disabled={saving}
                    />
                  </div>
                )}
                {formData.zoneType === 'Line' && (
                  <>
                    <div>
                      <label className="block text-xs text-gray-400">Длина</label>
                      <input
                        type="number"
                        value={formData.length}
                        onChange={e => setFormData({ ...formData, length: parseFloat(e.target.value) })}
                        className="w-full px-2 py-1 bg-gray-900 border border-gray-600 rounded text-white text-sm focus:ring-red-500 focus:border-red-500"
                        disabled={saving}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400">Толщина</label>
                      <input
                        type="number"
                        value={formData.width}
                        onChange={e => setFormData({ ...formData, width: parseFloat(e.target.value) })}
                        className="w-full px-2 py-1 bg-gray-900 border border-gray-600 rounded text-white text-sm focus:ring-red-500 focus:border-red-500"
                        disabled={saving}
                      />
                    </div>
                  </>
                )}
                {formData.zoneType === 'Rectangle' && (
                  <>
                    <div>
                      <label className="block text-xs text-gray-400">Ширина</label>
                      <input
                        type="number"
                        value={formData.width}
                        onChange={e => setFormData({ ...formData, width: parseFloat(e.target.value) })}
                        className="w-full px-2 py-1 bg-gray-900 border border-gray-600 rounded text-white text-sm focus:ring-red-500 focus:border-red-500"
                        disabled={saving}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400">Высота (длина)</label>
                      <input
                        type="number"
                        value={formData.length}
                        onChange={e => setFormData({ ...formData, length: parseFloat(e.target.value) })}
                        className="w-full px-2 py-1 bg-gray-900 border border-gray-600 rounded text-white text-sm focus:ring-red-500 focus:border-red-500"
                        disabled={saving}
                      />
                    </div>
                  </>
                )}
                {formData.zoneType === 'Cone' && (
                  <>
                    <div>
                      <label className="block text-xs text-gray-400">Длина</label>
                      <input
                        type="number"
                        value={formData.length}
                        onChange={e => setFormData({ ...formData, length: parseFloat(e.target.value) })}
                        className="w-full px-2 py-1 bg-gray-900 border border-gray-600 rounded text-white text-sm focus:ring-red-500 focus:border-red-500"
                        disabled={saving}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400">Угол (град.)</label>
                      <input
                        type="number"
                        value={formData.angle}
                        onChange={e => setFormData({ ...formData, angle: parseFloat(e.target.value) })}
                        className="w-full px-2 py-1 bg-gray-900 border border-gray-600 rounded text-white text-sm focus:ring-red-500 focus:border-red-500"
                        disabled={saving}
                      />
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-xs text-gray-400">Длительность (шагов)</label>
                  <input
                    type="number"
                    value={formData.durationSteps}
                    onChange={e => setFormData({ ...formData, durationSteps: parseInt(e.target.value) })}
                    className="w-full px-2 py-1 bg-gray-900 border border-gray-600 rounded text-white text-sm focus:ring-red-500 focus:border-red-500"
                    min={1}
                    disabled={saving}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={saveEdit}
                    className="px-3 py-1 bg-teal-600 text-white rounded text-sm hover:bg-teal-700 transition disabled:opacity-50"
                    disabled={saving}
                  >
                    {saving ? 'Сохранение...' : 'Сохранить'}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600 transition"
                    disabled={saving}
                  >
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-xs mt-1">
                {ab.zoneType}: {ab.zoneType === 'Circle' && `R=${ab.radius}`}
                {ab.zoneType === 'Line' && `L=${ab.length} W=${ab.width}`}
                {ab.zoneType === 'Rectangle' && `W=${ab.width} H=${ab.length}`}
                {ab.zoneType === 'Cone' && `L=${ab.length} ∠${ab.angle}°`}
                {` X=${ab.x?.toFixed(0)} Y=${ab.y?.toFixed(0)} Rot=${ab.rotation ?? 0}° Dur=${ab.durationSteps}`}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}