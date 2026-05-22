import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import BoardPage from './pages/BoardPage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<Navigate to="/workspace/select/board" replace />} />
        <Route element={<AppShell />}>
          <Route path="/workspace/:workspaceId/board" element={<BoardPage />} />
          <Route path="/workspace/:workspaceId/analytics" element={<AnalyticsPage />} />
          <Route path="/workspace/:workspaceId/settings" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
