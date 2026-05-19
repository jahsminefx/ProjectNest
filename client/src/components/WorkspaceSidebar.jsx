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
          {workspaces.map((workspace) => (
            <NavLink
              className={({ isActive }) =>
                [
                  'block rounded-md border px-3 py-3 transition',
                  isActive || workspace.id === activeWorkspaceId
                    ? 'border-accent bg-teal-50 text-accent'
                    : 'border-transparent text-slate-700 hover:border-line hover:bg-panel'
                ].join(' ')
              }
              key={workspace.id}
              to={`/workspace/${workspace.id}/board`}
            >
              <span className="block text-sm font-semibold">{workspace.name}</span>
              <span className="mt-1 block text-xs text-slate-500">
                {workspace.task_count || 0} tasks
              </span>
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
}

export default WorkspaceSidebar;
