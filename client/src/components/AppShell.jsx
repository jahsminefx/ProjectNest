import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { fetchWorkspaces } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import WorkspaceSidebar from './WorkspaceSidebar.jsx';

function AppShell() {
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const { logout, user } = useAuth();
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    fetchWorkspaces()
      .then((items) => {
        if (!active) return;
        setWorkspaces(items);

        if ((!workspaceId || workspaceId === 'select') && items.length > 0) {
          navigate(`/workspace/${items[0].id}/board`, { replace: true });
        }
      })
      .catch(() => {
        if (active) {
          setError('Could not load workspaces. Check the API server and database connection.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [navigate, workspaceId]);

  const activeWorkspace = useMemo(
    () => workspaces.find((workspace) => workspace.id === workspaceId),
    [workspaceId, workspaces]
  );

  return (
    <div className="min-h-screen bg-panel text-ink">
      <div className="flex min-h-screen">
        <WorkspaceSidebar
          activeWorkspaceId={workspaceId}
          error={error}
          loading={loading}
          workspaces={workspaces}
        />
        <main className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-line bg-white px-4 py-3 md:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                  Workspace Board
                </span>
                <h1 className="text-xl font-semibold text-ink md:text-2xl">
                  {activeWorkspace?.name || 'ProjectNest'}
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <span className="max-w-[12rem] truncate text-sm text-slate-600">{user?.email}</span>
                <button
                  className="rounded-md border border-line px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-accent hover:text-accent"
                  onClick={logout}
                  type="button"
                >
                  Sign out
                </button>
              </div>
            </div>
          </header>
          <Outlet context={{ activeWorkspace, workspaces }} />
        </main>
      </div>
    </div>
  );
}

export default AppShell;
