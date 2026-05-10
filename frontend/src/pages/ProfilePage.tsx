// ProfilePage.tsx (полный код)
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchDefaults, deleteDefault } from '../api/defaults';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import ImgWithFallback from '../components/ui/ImgWithFallback';
import type { DefaultListItemDto } from '../types';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, updateUser, updateAvatar } = useAuth();
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [saving, setSaving] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userDefaults, setUserDefaults] = useState<DefaultListItemDto[]>([]);
  const [loadingDefaults, setLoadingDefaults] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDefaults({ createdByUserId: user.id, pageSize: 100 })
        .then(res => setUserDefaults(res.items))
        .catch(err => toast.error('Не удалось загрузить ваши тактики'))
        .finally(() => setLoadingDefaults(false));
    }
  }, [user]);

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить тактику?')) return;
    try {
      await deleteDefault(id);
      setUserDefaults(prev => prev.filter(d => d.id !== id));
      toast.success('Тактика удалена');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка удаления');
    }
  };

  const handleStartEdit = () => { setNewUsername(user?.username || ''); setEditing(true); };
  const handleCancelEdit = () => { setEditing(false); setNewUsername(''); };
  const handleSave = async () => {
    if (!newUsername.trim() || newUsername === user?.username) { setEditing(false); return; }
    setSaving(true);
    try {
      await updateUser(newUsername.trim());
      toast.success('Никнейм обновлён');
      setEditing(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка обновления');
    } finally { setSaving(false); }
  };
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Вы вышли из системы');
      navigate('/');
    } catch { toast.error('Ошибка при выходе'); }
  };
  const handleAvatarClick = () => fileInputRef.current?.click();
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarLoading(true);
    try {
      await updateAvatar(file);
      toast.success('Аватар обновлён');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка загрузки');
    } finally { setAvatarLoading(false); e.target.value = ''; }
  };

  if (!user) return null;
  const initials = user.username?.charAt(0).toUpperCase() || '?';

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6 text-white">Профиль пользователя</h1>
          <div className="flex items-start gap-6 mb-6">
            <div className="flex-shrink-0 relative group cursor-pointer" onClick={handleAvatarClick} title="Нажмите, чтобы загрузить фото">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Аватар" className="w-48 h-48 rounded-full object-cover shadow-md" />
              ) : (
                <div className="w-48 h-48 bg-teal-600 rounded-full flex items-center justify-center text-6xl font-bold text-white shadow-md">{initials}</div>
              )}
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition">
                {avatarLoading ? <span className="text-white text-xs">Загрузка...</span> : <span className="text-white text-xs text-center px-1">Загрузить фото</span>}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/jpeg,image/png,image/gif" className="hidden" />
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">Имя пользователя</label>
                {editing ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white flex-1 focus:ring-teal-500 focus:border-teal-500" autoFocus />
                    <Button variant="accent" size="sm" onClick={handleSave} disabled={saving}>
                      {saving ? 'Сохранение...' : 'Сохранить'}
                    </Button>
                    <Button variant="secondary" size="sm" onClick={handleCancelEdit}>
                      Отмена
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-lg text-white">{user.username}</span>
                    <Button variant="ghost" size="sm" onClick={handleStartEdit}>
                      Изменить
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Email</label>
                <div className="mt-1 text-lg text-white">{user.email}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Роль</label>
                <div className="mt-1">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${user.role === 'Admin' ? 'bg-red-900/30 text-red-300 border border-red-500/50' : 'bg-gray-700 text-gray-300 border border-gray-600'}`}>
                    {user.role === 'Admin' ? 'Администратор' : 'Пользователь'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-700 space-y-2">
            <div className="flex gap-2">
              <Button variant="secondary" asChild>
                <Link to="/change-password">Сменить пароль</Link>
              </Button>
              <Button variant="danger" onClick={handleLogout}>
                Выйти из аккаунта
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 text-white">Мои тактики</h2>
          {loadingDefaults ? (
            <p className="text-gray-400">Загрузка...</p>
          ) : userDefaults.length === 0 ? (
            <p className="text-gray-400">У вас пока нет созданных тактик.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {userDefaults.map(def => (
                <Card key={def.id} className="overflow-hidden">
                  <ImgWithFallback
                    src={def.imageUrl || `/maps/${def.map.name.toLowerCase()}/${def.map.name.toLowerCase()}_preview.png`}
                    alt={def.map.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <Link to={`/defaults/${def.id}`} className="font-semibold text-white hover:text-teal-400 truncate block">{def.title}</Link>
                    <p className="text-sm text-gray-400">{def.team.name} · {def.side === 'Attack' ? 'Атака' : 'Защита'}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs text-gray-500">Шагов: {def.stepCount}</span>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(def.id)}>
                        🗑️
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}