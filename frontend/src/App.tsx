import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import TacticListPage from './pages/TacticListPage';
import TacticPreviewPage from './pages/TacticPreviewPage';
import TacticMapPage from './pages/TacticMapPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import ProtectedRoute from './components/ProtectedRoute';
import NewTacticPage from './pages/NewTacticPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 2000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <div className="flex flex-col h-screen overflow-hidden">
          <Header />
          <div className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/defaults" element={<TacticListPage />} />
              <Route path="/defaults/:id" element={<TacticPreviewPage />} />
              <Route path="/defaults/:id/map" element={<TacticMapPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/change-password" element={<ChangePasswordPage />} />
              </Route>
              <Route element={<ProtectedRoute requireAdmin />}>
                <Route path="/defaults/create" element={<NewTacticPage />} />
              </Route>
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;