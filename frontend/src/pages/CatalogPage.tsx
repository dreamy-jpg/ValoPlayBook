import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchDefaults, fetchMaps, fetchTeams } from '../api/defaults';
import FilterBar from '../components/FilterBar';
import type { DefaultListItemDto, MapDto, TeamDto } from '../types';

export default function CatalogPage() {
  const [defaults, setDefaults] = useState<DefaultListItemDto[]>([]);
  const [maps, setMaps] = useState<MapDto[]>([]);
  const [teams, setTeams] = useState<TeamDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedMapId, setSelectedMapId] = useState<number | undefined>();
  const [selectedTeamId, setSelectedTeamId] = useState<number | undefined>();
  const [selectedSide, setSelectedSide] = useState<string | undefined>();
  const [selectedRound, setSelectedRound] = useState<number | undefined>();

  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [mapsData, teamsData] = await Promise.all([fetchMaps(), fetchTeams()]);
        setMaps(mapsData);
        setTeams(teamsData);
      } catch (err) {
        console.error('Ошибка загрузки справочников:', err);
      }
    };
    loadData();
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
          roundNumber: selectedRound,
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
  }, [selectedMapId, selectedTeamId, selectedSide, selectedRound, pageNumber]);

  const handleFilterChange = (filters: { mapId?: number; teamId?: number; side?: string; roundNumber?: number }) => {
    setSelectedMapId(filters.mapId);
    setSelectedTeamId(filters.teamId);
    setSelectedSide(filters.side);
    setSelectedRound(filters.roundNumber);
    setPageNumber(1);
  };

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && defaults.length === 0) {
    return <div className="p-4 text-white">Загрузка...</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4">
      <h1 className="text-3xl font-bold mb-4 text-white">Тактические разборы</h1>

      <FilterBar maps={maps} teams={teams} onFilterChange={handleFilterChange} />

      {error && <div className="text-red-400 mb-4">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {defaults.map((def) => (
          <Link
            key={def.id}
            to={`/defaults/${def.id}`}
            className="block bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-red-400 transition shadow-md"
          >
            <div className="p-4">
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
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => handlePageChange(pageNumber - 1)}
            disabled={pageNumber <= 1}
            className="px-3 py-1 border border-gray-600 text-white rounded disabled:opacity-50 hover:bg-gray-700 transition"
          >
            Назад
          </button>
          <span className="px-3 py-1 text-white">
            {pageNumber} из {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pageNumber + 1)}
            disabled={pageNumber >= totalPages}
            className="px-3 py-1 border border-gray-600 text-white rounded disabled:opacity-50 hover:bg-gray-700 transition"
          >
            Вперёд
          </button>
        </div>
      )}
    </div>
  );
}