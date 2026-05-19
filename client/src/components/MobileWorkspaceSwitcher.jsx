function MobileWorkspaceSwitcher({ activeWorkspaceId, onChange, workspaces }) {
  return (
    <label className="block md:hidden">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        Workspace
      </span>
      <select
        className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-ink outline-none focus:border-accent focus:ring-2 focus:ring-teal-100"
        onChange={(event) => onChange(event.target.value)}
        value={activeWorkspaceId || ''}
      >
        {workspaces.map((workspace) => (
          <option key={workspace.id} value={workspace.id}>
            {workspace.name}
          </option>
        ))}
      </select>
    </label>
  );
}

export default MobileWorkspaceSwitcher;
