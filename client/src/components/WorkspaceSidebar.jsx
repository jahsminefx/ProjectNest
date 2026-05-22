import { NavLink } from 'react-router-dom';

function WorkspaceSidebar({ activeWorkspaceId, error, loading, workspaces }) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-line bg-white md:flex md:flex-col">
      <div className="border-b border-line px-5 py-5">
        <p className="text-lg font-bold text-ink">ProjectNest</p>
        <p className="mt-1 text-sm text-slate-500">Multi-tenant project boards</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Workspaces
        </div>

        {loading && (
          <div className="rounded-md border border-line bg-panel px-3 py-2 text-sm text-slate-600">
            Loading workspaces...
          </div>
        )}

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-1">
          {workspaces.map((workspace) => {
            const active = workspace.id === activeWorkspaceId;

            return (
              <div
                className={[
                  'rounded-md border transition',
                  active ? 'border-accent bg-teal-50' : 'border-transparent hover:border-line hover:bg-panel'
                ].join(' ')}
                key={workspace.id}
              >
                <NavLink className="block px-3 py-3" to={`/workspace/${workspace.id}/board`}>
                  <span className={['block text-sm font-semibold', active ? 'text-accent' : 'text-slate-700'].join(' ')}>
                    {workspace.name}
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">
                    {workspace.task_count || 0} tasks
                  </span>
                </NavLink>
                {active && (
                  <div className="border-t border-teal-100 px-2 pb-2">
                    <NavLink
                      className={({ isActive }) =>
                        [
                          'mt-2 block rounded px-2 py-1.5 text-xs font-semibold',
                          isActive ? 'bg-white text-accent' : 'text-slate-600 hover:bg-white'
                        ].join(' ')
                      }
                      to={`/workspace/${workspace.id}/analytics`}
                    >
                      Analytics
                    </NavLink>
                    {workspace.role === 'owner' && (
                      <NavLink
                        className={({ isActive }) =>
                          [
                            'mt-1 block rounded px-2 py-1.5 text-xs font-semibold',
                            isActive ? 'bg-white text-accent' : 'text-slate-600 hover:bg-white'
                          ].join(' ')
                        }
                        to={`/workspace/${workspace.id}/settings`}
                      >
                        Settings
                      </NavLink>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}

export default WorkspaceSidebar;
