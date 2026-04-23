import { useState } from 'react';
import toast from 'react-hot-toast';
import type { PositionDto } from '../types';
import { updatePosition } from '../api/defaults';

interface PositionEditorProps {
  positions: PositionDto[];
  onPositionUpdated: (updatedPosition: PositionDto) => void;
  disabled?: boolean;
}

export default function PositionEditor({ positions, onPositionUpdated, disabled }: PositionEditorProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ x: 0, y: 0, rotation: 0 });
  const [saving, setSaving] = useState(false);

  const startEdit = (pos: PositionDto) => {
    setEditingId(pos.id);
    setFormData({
      x: pos.x,
      y: pos.y,
      rotation: pos.rotation ?? 0,
    });
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async () => {
    if (editingId === null || saving) return;
    const positionToUpdate = positions.find(p => p.id === editingId);
    if (!positionToUpdate) return;

    const updatedData = {
      ...positionToUpdate,
      x: formData.x,
      y: formData.y,
      rotation: formData.rotation || null,
    };

    setSaving(true);
    try {
      await updatePosition(editingId, {
        x: formData.x,
        y: formData.y,
        rotation: formData.rotation || null,
      });
      onPositionUpdated(updatedData);
      setEditingId(null);
      toast.success('Позиция обновлена');
    } catch (err) {
      toast.error('Ошибка сохранения позиции');
    } finally {
      setSaving(false);
    }
  };

  if (disabled) return null;

  return (
    <div className="mt-4 p-3 bg-gray-800 rounded border border-gray-700">
      <h3 className="font-semibold mb-2 text-white">Редактор позиций</h3>
      <div className="space-y-3">
        {positions.map(pos => (
          <div key={pos.id} className="text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium text-white">{pos.agentName}</span>
              {editingId !== pos.id && (
                <button
                  onClick={() => startEdit(pos)}
                  className="px-2 py-1 bg-teal-500 text-white rounded text-xs hover:bg-teal-600 transition disabled:opacity-50"
                  disabled={saving}
                >
                  Изменить
                </button>
              )}
            </div>

            {editingId === pos.id ? (
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
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={saveEdit}
                    className="px-3 py-1 bg-teal-500 text-white rounded text-sm hover:bg-teal-600 transition disabled:opacity-50"
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
                X: {pos.x.toFixed(0)}, Y: {pos.y.toFixed(0)}{pos.rotation != null && `, Поворот: ${pos.rotation}°`}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}