import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import {
  deleteWorkspaceTask,
  fetchBoardTasks,
  fetchWorkspaceMembers,
  updateWorkspaceMemberRole
} from '../api/client.js';
import MobileWorkspaceSwitcher from '../components/MobileWorkspaceSwitcher.jsx';

const ROLE_OPTIONS = ['admin', 'member', 'viewer'];

function SettingsPage() {
  const navigate = useNavigate();
  const { activeWorkspace, workspaces } = useOutletContext();
  const { workspaceId } = useParams();
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingMemberId, setSavingMemberId] = useState('');
  const [deletingTaskId, setDeletingTaskId] = useState('');

  const ownerOnly = activeWorkspace?.role === 'owner';

  const activeTasks = useMemo(
    () => tasks.filter((task) => task.status !== 'DONE'),
    [tasks]
  );

  const loadSettings = useCallback(() => {
    if (!workspaceId || workspaceId === 'select' || !ownerOnly) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    Promise.all([
      fetchWorkspaceMembers(workspaceId),
      fetchBoardTasks(workspaceId)
    ])
      .then(([memberRows, board]) => {
        setMembers(memberRows);
        setTasks(board.tasks);
      })
      .catch((requestError) => {
        const fallback = requestError.response?.status === 403
          ? 'Only workspace owners can manage settings.'
          : 'Could not load workspace settings.';
        setError(fallback);
      })
      .finally(() => setLoading(false));
  }, [ownerOnly, workspaceId]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleRoleChange = async (userId, role) => {
    const previousMembers = members;
    setSavingMemberId(userId);
    setMembers((currentMembers) => currentMembers.map((member) => (
      member.id === userId ? { ...member, role } : member
    )));

    try {
      await updateWorkspaceMemberRole(workspaceId, userId, role);
    } catch (requestError) {
      setMembers(previousMembers);
      alert(requestError.response?.data?.error || 'The member role could not be updated.');
    } finally {
      setSavingMemberId('');
    }
  };

  const handleDeleteTask = async (taskId) => {
    const task = tasks.find((item) => item.id === taskId);
    const confirmed = window.confirm(`Delete "${task?.title || 'this task'}"?`);

    if (!confirmed) return;

    const previousTasks = tasks;
    setDeletingTaskId(taskId);
    setTasks((currentTasks) => currentTasks.filter((item) => item.id !== taskId));

    try {
      await deleteWorkspaceTask(workspaceId, taskId);
    } catch (requestError) {
      setTasks(previousTasks);
      alert(requestError.response?.data?.error || 'The task could not be deleted.');
    } finally {
      setDeletingTaskId('');
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-auto p-4 md:p-6">
      <MobileWorkspaceSwitcher
        activeWorkspaceId={workspaceId}
        onChange={(nextWorkspaceId) => navigate(`/workspace/${nextWorkspaceId}/settings`)}
        workspaces={workspaces}
      />

      <section className="border-b border-line pb-4">
        <p className="text-sm font-medium text-slate-500">{activeWorkspace?.slug || 'workspace'}</p>
        <h2 className="mt-1 text-2xl font-semibold text-ink">Workspace Settings</h2>
      </section>

      {!ownerOnly && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Only workspace owners can adjust member roles or delete tasks.
        </div>
      )}

      {ownerOnly && loading && (
        <div className="rounded-md border border-line bg-white p-6 text-sm text-slate-600">
          Loading settings...
        </div>
      )}

      {ownerOnly && error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {ownerOnly && !loading && !error && (
        <>
          <section className="rounded-md border border-line bg-white">
            <div className="border-b border-line px-4 py-3">
              <h3 className="text-base font-semibold text-ink">Members</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-line text-sm">
                <thead className="bg-panel text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Member</th>
                    <th className="px-4 py-3">Active Tasks</th>
                    <th className="px-4 py-3">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {members.map((member) => (
                    <tr key={member.id}>
                      <td className="px-4 py-3">
                        <span className="block font-semibold text-ink">{member.name}</span>
                        <span className="block text-xs text-slate-500">{member.email}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{member.active_task_count}</td>
                      <td className="px-4 py-3">
                        {member.role === 'owner' ? (
                          <span className="rounded-md border border-line bg-panel px-2.5 py-1.5 text-xs font-semibold text-slate-700">
                            owner
                          </span>
                        ) : (
                          <select
                            className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-ink outline-none focus:border-accent focus:ring-2 focus:ring-teal-100"
                            disabled={savingMemberId === member.id}
                            onChange={(event) => handleRoleChange(member.id, event.target.value)}
                            value={member.role}
                          >
                            {ROLE_OPTIONS.map((role) => (
                              <option key={role} value={role}>{role}</option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-md border border-line bg-white">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <h3 className="text-base font-semibold text-ink">Delete Tasks</h3>
              <span className="text-sm text-slate-500">{activeTasks.length} active</span>
            </div>
            <div className="divide-y divide-line">
              {tasks.map((task) => (
                <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between" key={task.id}>
                  <div>
                    <p className="font-semibold text-ink">{task.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {task.status} · {task.priority} · {task.assignee_name || 'Unassigned'}
                    </p>
                  </div>
                  <button
                    className="rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:text-slate-400"
                    disabled={deletingTaskId === task.id}
                    onClick={() => handleDeleteTask(task.id)}
                    type="button"
                  >
                    {deletingTaskId === task.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              ))}
              {tasks.length === 0 && (
                <p className="px-4 py-6 text-sm text-slate-500">No tasks to manage.</p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default SettingsPage;
