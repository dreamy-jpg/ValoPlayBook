import { useEffect, useState } from 'react';
import type { MapDto, TeamDto } from '../types';
import { fetchMaps, fetchTeams } from '../api/defaults';

interface FilterBarProps {
  onFilterChange: (filters: {
    mapId?: number;
    teamId?: number;
    side?: string;
    roundNumber?: number;
  }) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [maps, setMaps] = useState<MapDto[]>([]);
  const [teams, setTeams] = useState<TeamDto[]>([]);
  const [selectedMapId, setSelectedMapId] = useState<number | undefined>(undefined);
  const [selectedTeamId, setSelectedTeamId] = useState<number | undefined>(undefined);
  const [selectedSide, setSelectedSide] = useState<string>('');
  const [roundNumber, setRoundNumber] = useState<number | undefined>(undefined);

  useEffect(() => {
    Promise.all([fetchMaps(), fetchTeams()])
      .then(([mapsData, teamsData]) => {
        setMaps(mapsData);
        setTeams(teamsData);
      })
      .catch(err => console.error('Ошибка загрузки фильтров:', err));
  }, []);

  const handleFilterChange = () => {
    onFilterChange({
      mapId: selectedMapId,
      teamId: selectedTeamId,
      side: selectedSide || undefined,
      roundNumber: roundNumber,
    });
  };

  const handleReset = () => {
    setSelectedMapId(undefined);
    setSelectedTeamId(undefined);
    setSelectedSide('');
    setRoundNumber(undefined);
    onFilterChange({});
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-6 flex flex-wrap gap-4 items-end border border-gray-700">
      <div>
        <label className="block text-sm font-medium text-gray-300">Карта</label>
        <select
          className="mt-1 p-2 bg-gray-900 border border-gray-600 rounded text-white focus:ring-red-500 focus:border-red-500"
          value={selectedMapId ?? ''}
          onChange={(e) => setSelectedMapId(e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="">Все карты</option>
          {maps.map(map => (
            <option key={map.id} value={map.id}>{map.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Команда</label>
        <select
          className="mt-1 p-2 bg-gray-900 border border-gray-600 rounded text-white focus:ring-red-500 focus:border-red-500"
          value={selectedTeamId ?? ''}
          onChange={(e) => setSelectedTeamId(e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="">Все команды</option>
          {teams.map(team => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Сторона</label>
        <select
          className="mt-1 p-2 bg-gray-900 border border-gray-600 rounded text-white focus:ring-red-500 focus:border-red-500"
          value={selectedSide}
          onChange={(e) => setSelectedSide(e.target.value)}
        >
          <option value="">Любая</option>
          <option value="Attack">Атака</option>
          <option value="Defense">Защита</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Раунд (необяз.)</label>
        <input
          type="number"
          className="mt-1 p-2 bg-gray-900 border border-gray-600 rounded w-24 text-white focus:ring-red-500 focus:border-red-500"
          value={roundNumber ?? ''}
          onChange={(e) => setRoundNumber(e.target.value ? Number(e.target.value) : undefined)}
          min={1}
        />
      </div>

      <button
        onClick={handleFilterChange}
        className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Применить
      </button>

      <button
        onClick={handleReset}
        className="bg-gray-700 text-gray-300 px-4 py-2 rounded hover:bg-gray-600 transition"
      >
        Сбросить
      </button>
    </div>
  );
}