import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell.jsx';
import BoardPage from './pages/BoardPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/workspace/select/board" replace />} />
      <Route element={<AppShell />}>
        <Route path="/workspace/:workspaceId/board" element={<BoardPage />} />
      </Route>
    </Routes>
  );
}

export default App;
