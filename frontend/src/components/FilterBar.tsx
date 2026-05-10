// FilterBar.tsx (полный код)
import { useState } from 'react';
import type { MapDto, TeamDto } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface FilterBarProps {
  maps: MapDto[];
  teams: TeamDto[];
  onFilterChange: (filters: {
    mapId?: number;
    teamId?: number;
    side?: string;
  }) => void;
}

export default function FilterBar({ maps, teams, onFilterChange }: FilterBarProps) {
  const [selectedMapId, setSelectedMapId] = useState<number | undefined>(undefined);
  const [selectedTeamId, setSelectedTeamId] = useState<number | undefined>(undefined);
  const [selectedSide, setSelectedSide] = useState<string>('');

  const handleFilterChange = () => {
    onFilterChange({
      mapId: selectedMapId,
      teamId: selectedTeamId,
      side: selectedSide || undefined,
    });
  };

  const handleReset = () => {
    setSelectedMapId(undefined);
    setSelectedTeamId(undefined);
    setSelectedSide('');
    onFilterChange({});
  };

  return (
    <Card className="p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-end">
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

        <Button variant="danger" onClick={handleFilterChange}>
          Применить
        </Button>

        <Button variant="secondary" onClick={handleReset}>
          Сбросить
        </Button>
      </div>
    </Card>
  );
}