import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      toast.success('Вход выполнен');
      navigate('/defaults');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Вход в ValoPlayBook</h2>
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div>
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
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
              autoComplete="off"
              className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-500 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400">
          Нет аккаунта?{' '}
          <Link to="/register" className="font-medium text-red-400 hover:text-red-300 transition">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}