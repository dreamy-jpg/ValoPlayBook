import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const location = useLocation();
  const { user } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-gray-900 text-white shadow-md border-b-4 border-red-400">
      <div className="mx-auto px-4 sm:px-6 lg:px-16">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight">ValoPlayBook</span>
            <span className="text-xs bg-red-400 px-2 py-0.5 rounded-full">beta</span>
          </Link>

          <nav className="flex items-center space-x-4">
            <Link
              to="/defaults"
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/defaults')
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Каталог
            </Link>

            {user ? (
              <Link
                to="/profile"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition"
              >
                Профиль
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition"
              >
                Войти
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}