// Header.tsx (полный код)
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';

export default function Header() {
  const location = useLocation();
  const { user } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-gray-900 text-white shadow-md border-b-4 border-red-400 px-8">
      <div className="flex items-center justify-between h-16">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tight">ValoPlayBook</span>
          <span className="text-xs bg-red-400 px-2 py-0.5 rounded-full">beta</span>
        </Link>

        <nav className="flex items-center space-x-2">
          <Button
            variant={isActive('/defaults') ? 'secondary' : 'ghost'}
            size="sm"
            asChild
          >
            <Link to="/defaults">Каталог</Link>
          </Button>

          {user ? (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/profile">Профиль</Link>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Войти</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}