import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (password !== confirmPassword) {
      setValidationError('Пароли не совпадают');
      return;
    }
    if (password.length < 6) {
      setValidationError('Пароль должен содержать минимум 6 символов');
      return;
    }

    setLoading(true);
    try {
      await register({ email, username, password });
      toast.success('Регистрация успешна! Теперь войдите.');
      navigate('/login');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Регистрация</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-500 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Имя пользователя</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-500 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-500 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Подтверждение пароля</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-500 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {validationError && (
            <div className="text-sm text-red-400 text-center bg-red-900/30 p-2 rounded border border-red-500/50">
              {validationError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition"
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="font-medium text-red-400 hover:text-red-300 transition">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}