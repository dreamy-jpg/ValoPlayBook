// NewTacticPage.tsx (полный код)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDefault, fetchMaps, fetchTeams, uploadDefaultImage } from '../api/defaults';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import type { MapDto, TeamDto } from '../types';
import toast from 'react-hot-toast';

export default function CreateDefaultPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [maps, setMaps] = useState<MapDto[]>([]);
  const [teams, setTeams] = useState<TeamDto[]>([]);
  const [title, setTitle] = useState('');
  const [teamId, setTeamId] = useState<number | undefined>();
  const [mapId, setMapId] = useState<number | undefined>();
  const [side, setSide] = useState('Attack');
  const [description, setDescription] = useState('');
  const [roundNumber, setRoundNumber] = useState<number | undefined>();
  const [opponent, setOpponent] = useState('');
  const [youtube, setYoutube] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([fetchMaps(), fetchTeams()])
      .then(([m, t]) => { setMaps(m); setTeams(t); })
      .catch(err => toast.error('Не удалось загрузить справочники'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !teamId || !mapId) {
      toast.error('Название, команда и карта обязательны');
      return;
    }
    setLoading(true);
    try {
      const created = await createDefault({
        title: title.trim(),
        teamId,
        mapId,
        side,
        description: description.trim() || undefined,
        roundNumber: roundNumber ?? undefined,
        opponentTeamName: opponent.trim() || undefined,
        youtubeUrl: youtube.trim() || undefined,
        imageUrl: undefined, // URL не используется
      });
      if (imageFile) {
        await uploadDefaultImage(created.id, imageFile);
      }
      toast.success('Тактика создана');
      navigate(`/defaults/${created.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка создания');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'Admin') {
    return <div className="p-4 text-white">Доступ запрещён</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Новая тактика</h1>
      <Card className="p-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Название *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="mt-1 w-full p-2 bg-gray-900 border border-gray-600 rounded text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Команда *</label>
              <select
                value={teamId ?? ''}
                onChange={e => setTeamId(e.target.value ? Number(e.target.value) : undefined)}
                className="mt-1 w-full p-2 bg-gray-900 border border-gray-600 rounded text-white"
                required
              >
                <option value="">Выберите команду</option>
                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Карта *</label>
              <select
                value={mapId ?? ''}
                onChange={e => setMapId(e.target.value ? Number(e.target.value) : undefined)}
                className="mt-1 w-full p-2 bg-gray-900 border border-gray-600 rounded text-white"
                required
              >
                <option value="">Выберите карту</option>
                {maps.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Сторона *</label>
            <div className="mt-1 flex gap-4">
              <label className="flex items-center text-white">
                <input
                  type="radio"
                  name="side"
                  value="Attack"
                  checked={side === 'Attack'}
                  onChange={() => setSide('Attack')}
                  className="mr-2"
                />
                Атака
              </label>
              <label className="flex items-center text-white">
                <input
                  type="radio"
                  name="side"
                  value="Defense"
                  checked={side === 'Defense'}
                  onChange={() => setSide('Defense')}
                  className="mr-2"
                />
                Защита
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Описание</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="mt-1 w-full p-2 bg-gray-900 border border-gray-600 rounded text-white"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Раунд</label>
              <input
                type="number"
                value={roundNumber ?? ''}
                onChange={e => setRoundNumber(e.target.value ? Number(e.target.value) : undefined)}
                className="mt-1 w-full p-2 bg-gray-900 border border-gray-600 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Противник</label>
              <input
                type="text"
                value={opponent}
                onChange={e => setOpponent(e.target.value)}
                className="mt-1 w-full p-2 bg-gray-900 border border-gray-600 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">YouTube URL</label>
              <input
                type="url"
                value={youtube}
                onChange={e => setYoutube(e.target.value)}
                className="mt-1 w-full p-2 bg-gray-900 border border-gray-600 rounded text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Изображение (необязательно)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="mt-1 text-sm text-gray-300 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-gray-700 file:text-white hover:file:bg-gray-600"
            />
            {imageFile && <p className="text-xs text-gray-400 mt-1">Выбран файл: {imageFile.name}</p>}
          </div>

          <Button
            type="submit"
            variant="danger"
            disabled={loading}
          >
            {loading ? 'Создание...' : 'Создать тактику'}
          </Button>
        </form>
      </Card>
    </div>
  );
}