// TacticListPage.tsx (полный код)
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchDefaults, fetchMaps, fetchTeams, deleteDefault } from '../api/defaults';
import FilterBar from '../components/FilterBar';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import ImgWithFallback from '../components/ui/ImgWithFallback';
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
    return `/maps/${def.map.name.toLowerCase()}/${def.map.name.toLowerCase()}_preview.png`;
  };

  if (loading && defaults.length === 0) return <div className="p-4 text-white">Загрузка...</div>;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-white">Тактические разборы</h1>
        {user?.role === 'Admin' && (
          <Button variant="accent" asChild>
            <Link to="/defaults/create">Создать тактику</Link>
          </Button>
        )}
      </div>

      <FilterBar maps={maps} teams={teams} onFilterChange={handleFilterChange} />
      {error && <div className="text-danger-500 mb-4">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {defaults.map(def => (
          <Card key={def.id} className="overflow-hidden transition-all hover:border-primary-500/50 relative">
            <Link to={`/defaults/${def.id}`} className="block">
              <div className="relative h-32 w-full overflow-hidden bg-dark-300">
                <ImgWithFallback
                  src={getMapThumbnail(def)}
                  alt={def.map.name}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg font-semibold truncate">{def.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                <p className="text-sm text-gray-400">
                  {def.team.name} · {def.map.name} · {def.side === 'Attack' ? 'Атака' : 'Защита'}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Шагов: {def.stepCount}</span>
                  {def.roundNumber && <span>Раунд {def.roundNumber}</span>}
                </div>
                {def.description && (
                  <p className="text-sm text-gray-300 line-clamp-2">{def.description}</p>
                )}
              </CardContent>
            </Link>
            {canDelete(def) && (
              <div className="absolute top-2 right-2 z-10">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDelete(def.id);
                  }}
                  title="Удалить тактику"
                >
                  🗑️
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handlePageChange(pageNumber - 1)}
            disabled={pageNumber <= 1}
          >
            Назад
          </Button>
          <Badge variant="outline" className="px-3 py-1 text-white">
            {pageNumber} из {totalPages}
          </Badge>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handlePageChange(pageNumber + 1)}
            disabled={pageNumber >= totalPages}
          >
            Вперёд
          </Button>
        </div>
      )}
    </div>
  );
}