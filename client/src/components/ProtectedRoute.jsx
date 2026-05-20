import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function ProtectedRoute() {
  const location = useLocation();
  const { loading, token } = useAuth();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-panel px-4 text-sm text-slate-600">
        Loading secure workspace...
      </div>
    );
  }

  if (!token) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
