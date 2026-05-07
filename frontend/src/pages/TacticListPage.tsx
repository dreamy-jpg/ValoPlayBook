import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchDefaults, fetchMaps, fetchTeams, deleteDefault } from '../api/defaults';
import FilterBar from '../components/FilterBar';
import { useAuth } from '../context/AuthContext';
import type { DefaultListItemDto, MapDto, TeamDto } from '../types';
import toast from 'react-hot-toast';

export default function CatalogPage() {
  const { user } = useAuth();
  const [defaults, setDefaults] = useState<DefaultListItemDto[]>([]);
  const [maps, setMaps] = useState<MapDto[]>([]);
  const [teams, setTeams] = useState<TeamDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedMapId, setSelectedMapId] = useState<number | undefined>();
  const [selectedTeamId, setSelectedTeamId] = useState<number | undefined>();
  const [selectedSide, setSelectedSide] = useState<string | undefined>();

  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    Promise.all([fetchMaps(), fetchTeams()])
      .then(([m, t]) => { setMaps(m); setTeams(t); })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const loadDefaults = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchDefaults({
          mapId: selectedMapId,
          teamId: selectedTeamId,
          side: selectedSide,
          pageNumber,
          pageSize,
        });
        setDefaults(result.items);
        setTotalPages(result.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки дефолтов');
      } finally {
        setLoading(false);
      }
    };
    loadDefaults();
  }, [selectedMapId, selectedTeamId, selectedSide, pageNumber]);

  const handleFilterChange = (filters: { mapId?: number; teamId?: number; side?: string }) => {
    setSelectedMapId(filters.mapId);
    setSelectedTeamId(filters.teamId);
    setSelectedSide(filters.side);
    setPageNumber(1);
  };

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить тактику? Это действие необратимо.')) return;
    try {
      await deleteDefault(id);
      setDefaults(prev => prev.filter(d => d.id !== id));
      toast.success('Тактика удалена');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка удаления');
    }
  };

  const canDelete = (def: DefaultListItemDto) => {
    if (!user) return false;
    return user.role === 'Admin' || user.id === def.createdByUserId;
  };

  const getMapThumbnail = (def: DefaultListItemDto) => {
    if (def.imageUrl) return def.imageUrl;
    // Новый путь: папка карты / превью
    return `/maps/${def.map.name.toLowerCase()}/${def.map.name.toLowerCase()}_preview.png`;
  };

  if (loading && defaults.length === 0) return <div className="p-4 text-white">Загрузка...</div>;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-white">Тактические разборы</h1>
        {user?.role === 'Admin' && (
          <Link to="/defaults/create" className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition">
            Создать тактику
          </Link>
        )}
      </div>

      <FilterBar maps={maps} teams={teams} onFilterChange={handleFilterChange} />
      {error && <div className="text-red-400 mb-4">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {defaults.map(def => (
          <div key={def.id} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-md hover:border-red-400 transition relative">
            <Link to={`/defaults/${def.id}`} className="block">
              <img
                src={getMapThumbnail(def)}
                alt={def.map.name}
                className="w-full h-32 object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = '/maps/_fallback.png'; }}
              />
            </Link>

            {canDelete(def) && (
              <button
                onClick={(e) => { e.preventDefault(); handleDelete(def.id); }}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded opacity-80"
                title="Удалить тактику"
              >
                🗑️
              </button>
            )}

            <Link to={`/defaults/${def.id}`} className="block p-4">
              <h2 className="font-semibold text-lg mb-1 truncate text-white">{def.title}</h2>
              <p className="text-sm text-gray-400 mb-2">
                {def.team.name} · {def.map.name} · {def.side === 'Attack' ? 'Атака' : 'Защита'}
              </p>
              <p className="text-xs text-gray-500">
                Шагов: {def.stepCount} · Раунд {def.roundNumber ?? '—'}
              </p>
              {def.description && (
                <p className="text-sm text-gray-300 mt-2 line-clamp-2">{def.description}</p>
              )}
            </Link>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button onClick={() => handlePageChange(pageNumber - 1)} disabled={pageNumber <= 1}
            className="px-3 py-1 border border-gray-600 text-white rounded disabled:opacity-50 hover:bg-gray-700 transition">
            Назад
          </button>
          <span className="px-3 py-1 text-white">{pageNumber} из {totalPages}</span>
          <button onClick={() => handlePageChange(pageNumber + 1)} disabled={pageNumber >= totalPages}
            className="px-3 py-1 border border-gray-600 text-white rounded disabled:opacity-50 hover:bg-gray-700 transition">
            Вперёд
          </button>
        </div>
      )}
    </div>
  );
}