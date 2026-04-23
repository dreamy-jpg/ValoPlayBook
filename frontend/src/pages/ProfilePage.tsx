import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, updateUser, updateAvatar } = useAuth();
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [saving, setSaving] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartEdit = () => {
    setNewUsername(user?.username || '');
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setNewUsername('');
  };

  const handleSave = async () => {
    if (!newUsername.trim() || newUsername === user?.username) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await updateUser(newUsername.trim());
      toast.success('Никнейм обновлён');
      setEditing(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка обновления');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Вы вышли из системы');
      navigate('/');
    } catch {
      toast.error('Ошибка при выходе');
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarLoading(true);
    try {
      await updateAvatar(file);
      toast.success('Аватар обновлён');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка загрузки');
    } finally {
      setAvatarLoading(false);
      e.target.value = '';
    }
  };

  if (!user) return null;

  const initials = user.username?.charAt(0).toUpperCase() || '?';

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
        <h1 className="text-2xl font-bold mb-6 text-white">Профиль пользователя</h1>

        <div className="flex items-start gap-6 mb-6">
          {/* Аватарка */}
          <div
            className="flex-shrink-0 relative group cursor-pointer"
            onClick={handleAvatarClick}
            title="Нажмите, чтобы загрузить фото"
          >
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="Аватар"
                className="w-48 h-48 rounded-full object-cover shadow-md"
              />
            ) : (
              <div className="w-48 h-48 bg-teal-600 rounded-full flex items-center justify-center text-6xl font-bold text-white shadow-md">
                {initials}
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition">
              {avatarLoading ? (
                <span className="text-white text-xs">Загрузка...</span>
              ) : (
                <span className="text-white text-xs text-center px-1">Загрузить фото</span>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/gif"
              className="hidden"
            />
          </div>

          {/* Информация */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400">Имя пользователя</label>
              {editing ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white flex-1 focus:ring-teal-500 focus:border-teal-500"
                    autoFocus
                  />
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-3 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition disabled:opacity-50"
                  >
                    {saving ? 'Сохранение...' : 'Сохранить'}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
                  >
                    Отмена
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between mt-1">
                  <span className="text-lg text-white">{user.username}</span>
                  <button
                    onClick={handleStartEdit}
                    className="text-teal-400 hover:text-teal-300 text-sm transition"
                  >
                     Изменить
                  </button>
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
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    user.role === 'Admin'
                      ? 'bg-red-900/30 text-red-300 border border-red-500/50'
                      : 'bg-gray-700 text-gray-300 border border-gray-600'
                  }`}
                >
                  {user.role === 'Admin' ? 'Администратор' : 'Пользователь'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition shadow-sm"
          >
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  );
}