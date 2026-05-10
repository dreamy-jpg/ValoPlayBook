// TacticPreviewPage.tsx (полный код)
import { useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDefaultData } from '../hooks/useDefaultData';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import ImgWithFallback from '../components/ui/ImgWithFallback';
import CommentSection from '../components/CommentSection';
import { uploadDefaultImage } from '../api/defaults';
import toast from 'react-hot-toast';

export default function TacticPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { defaultData, loading, error, reload } = useDefaultData(id);
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [hoverImage, setHoverImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canEdit = () => {
    if (!user) return false;
    if (user.role === 'Admin') return true;
    return defaultData?.createdByUserId === user.id;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !defaultData) return;
    setUploading(true);
    try {
      await uploadDefaultImage(defaultData.id, file);
      toast.success('Изображение загружено');
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-white">Загрузка...</div>;
  if (error || !defaultData) return <div className="p-4 text-danger-500">Ошибка: {error || 'Тактика не найдена'}</div>;

  const sideLabel = defaultData.side === 'Attack' ? 'Атака' : 'Защита';
  const roundInfo = defaultData.roundNumber ? `Раунд ${defaultData.roundNumber}` : '';
  const previewImage = defaultData.imageUrl || `/maps/${defaultData.map.name.toLowerCase()}/${defaultData.map.name.toLowerCase()}_preview.png`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Верхняя строка с навигацией и кнопкой редактирования */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          ← Назад
        </Button>
        {canEdit() && (
          <Button variant="accent" size="sm" asChild>
            <Link to={`/defaults/${id}/map`}>Редактировать</Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Левая колонка */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{defaultData.title}</h1>
          <div className="text-gray-400 space-x-2 mb-4">
            <span>{defaultData.team.name}</span> · <span>{defaultData.map.name}</span> · <span>{sideLabel}</span>
            {roundInfo && <span> · {roundInfo}</span>}
            {defaultData.opponentTeamName && <span> · Против {defaultData.opponentTeamName}</span>}
          </div>

          {/* Карточка с изображением и оверлеем загрузки */}
          <Card className="overflow-hidden">
            <div
              className="relative"
              onMouseEnter={() => canEdit() && setHoverImage(true)}
              onMouseLeave={() => setHoverImage(false)}
            >
              <ImgWithFallback
                src={previewImage}
                alt={defaultData.title}
                className="w-full object-contain max-h-96"
              />
              {canEdit() && hoverImage && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer transition-opacity">
                  <div className="text-white text-center">
                    <svg className="w-10 h-10 mx-auto mb-1 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-sm font-medium">
                      {uploading ? 'Загрузка...' : 'Загрузить изображение'}
                    </span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Правая колонка */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Описание</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">{defaultData.description || 'Нет описания'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge variant="secondary">Шагов: {defaultData.steps.length}</Badge>
              {defaultData.youtubeUrl && (
                <a
                  href={defaultData.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-accent-500 hover:text-accent-400 transition"
                >
                  📺 Смотреть на YouTube
                </a>
              )}
            </CardContent>
          </Card>

          {defaultData.createdByUserName && (
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Avatar
                  src={defaultData.createdByUserAvatar}
                  fallback={defaultData.createdByUserName}
                  size="md"
                />
                <div>
                  <p className="text-gray-400 text-sm">Автор</p>
                  <p className="text-white font-medium">{defaultData.createdByUserName}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Button variant="accent" asChild className="w-full">
            <Link to={`/defaults/${id}/map`}>Смотреть</Link>
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <CommentSection defaultId={defaultData.id} />
      </div>
    </div>
  );
}