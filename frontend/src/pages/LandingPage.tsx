// frontend/src/pages/LandingPage.tsx
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
            ValoPlayBook
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Изучайте тактики профессиональных команд Valorant.
            Пошаговые разборы, позиции агентов и зоны способностей.
          </p>
          <Link
            to="/defaults"
            className="inline-block px-8 py-4 bg-red-400 hover:bg-red-700 text-white font-semibold rounded-lg text-lg transition shadow-lg"
          >
            Смотреть разборы
          </Link>
        </div>

        {/* Опционально: блок с фичами */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-gray-800 rounded-xl">
            <div className="text-3xl mb-3"></div>
            <h3 className="text-xl font-semibold mb-2">Интерактивные карты</h3>
            <p className="text-gray-400">
              Позиции агентов и зоны способностей на реальных картах игры
            </p>
          </div>
          <div className="p-6 bg-gray-800 rounded-xl">
            <div className="text-3xl mb-3"></div>
            <h3 className="text-xl font-semibold mb-2">Пошаговые сценарии</h3>
            <p className="text-gray-400">
              Переключайтесь между шагами раунда и смотрите развитие атаки/защиты
            </p>
          </div>
          <div className="p-6 bg-gray-800 rounded-xl">
            <div className="text-3xl mb-3"></div>
            <h3 className="text-xl font-semibold mb-2">Редактор тактик</h3>
            <p className="text-gray-400">
              Создавайте и изменяйте расстановки, перетаскивая агентов и способности
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}