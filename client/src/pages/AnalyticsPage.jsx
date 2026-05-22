import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { fetchWorkspaceAnalytics } from '../api/client.js';
import MobileWorkspaceSwitcher from '../components/MobileWorkspaceSwitcher.jsx';
import { useNavigate } from 'react-router-dom';

function numberValue(value) {
  return Number(value || 0);
}

function AnalyticsPage() {
  const navigate = useNavigate();
  const { activeWorkspace, workspaces } = useOutletContext();
  const { workspaceId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAnalytics = useCallback(() => {
    if (!workspaceId || workspaceId === 'select') {
      setLoading(false);
      setAnalytics(null);
      return;
    }

    setLoading(true);
    setError('');

    fetchWorkspaceAnalytics(workspaceId)
      .then(setAnalytics)
      .catch(() => setError('Could not load analytics for this workspace.'))
      .finally(() => setLoading(false));
  }, [workspaceId]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const maxVelocity = useMemo(() => {
    const values = analytics?.velocityByWeek?.map((row) => numberValue(row.completed_count)) || [];
    return Math.max(1, ...values);
  }, [analytics]);

  const summary = analytics?.summary || {};

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-auto p-4 md:p-6">
      <MobileWorkspaceSwitcher
        activeWorkspaceId={workspaceId}
        onChange={(nextWorkspaceId) => navigate(`/workspace/${nextWorkspaceId}/analytics`)}
        workspaces={workspaces}
      />

      <section className="border-b border-line pb-4">
        <p className="text-sm font-medium text-slate-500">{activeWorkspace?.slug || 'workspace'}</p>
        <h2 className="mt-1 text-2xl font-semibold text-ink">Analytics</h2>
      </section>

      {loading && (
        <div className="rounded-md border border-line bg-white p-6 text-sm text-slate-600">
          Loading analytics...
        </div>
      )}

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && analytics && (
        <>
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-md border border-line bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Velocity</p>
              <p className="mt-2 text-3xl font-semibold text-ink">{summary.team_velocity_30_days}</p>
              <p className="mt-1 text-sm text-slate-500">Done in 30 days</p>
            </div>
            <div className="rounded-md border border-line bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Backlog</p>
              <p className="mt-2 text-3xl font-semibold text-ink">{summary.active_backlog_items}</p>
              <p className="mt-1 text-sm text-slate-500">Active tasks</p>
            </div>
            <div className="rounded-md border border-line bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Created</p>
              <p className="mt-2 text-3xl font-semibold text-ink">{summary.tasks_created_30_days}</p>
              <p className="mt-1 text-sm text-slate-500">New in 30 days</p>
            </div>
            <div className="rounded-md border border-line bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cycle time</p>
              <p className="mt-2 text-3xl font-semibold text-ink">{summary.average_cycle_time_days}</p>
              <p className="mt-1 text-sm text-slate-500">Average days</p>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-md border border-line bg-white p-4">
              <h3 className="text-base font-semibold text-ink">Weekly Velocity</h3>
              <div className="mt-4 space-y-3">
                {(analytics.velocityByWeek || []).map((row) => {
                  const count = numberValue(row.completed_count);

                  return (
                    <div className="grid grid-cols-[7rem_1fr_3rem] items-center gap-3" key={row.week_start}>
                      <span className="text-sm text-slate-600">{row.week_start}</span>
                      <div className="h-2 rounded-full bg-panel">
                        <div
                          className="h-2 rounded-full bg-accent"
                          style={{ width: `${Math.max(8, (count / maxVelocity) * 100)}%` }}
                        />
                      </div>
                      <span className="text-right text-sm font-semibold text-ink">{count}</span>
                    </div>
                  );
                })}
                {analytics.velocityByWeek?.length === 0 && (
                  <p className="text-sm text-slate-500">No completed tasks in the last eight weeks.</p>
                )}
              </div>
            </div>

            <div className="rounded-md border border-line bg-white p-4">
              <h3 className="text-base font-semibold text-ink">Active Backlog</h3>
              <div className="mt-4 space-y-3">
                {(analytics.backlogByStatus || []).map((row) => (
                  <div className="flex items-center justify-between rounded-md border border-line px-3 py-2" key={row.status}>
                    <span className="text-sm font-medium text-slate-700">{row.status}</span>
                    <span className="text-sm font-semibold text-ink">{row.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-md border border-line bg-white">
            <div className="border-b border-line px-4 py-3">
              <h3 className="text-base font-semibold text-ink">Individual Allocations</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-line text-sm">
                <thead className="bg-panel text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Member</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Active</th>
                    <th className="px-4 py-3">To Do</th>
                    <th className="px-4 py-3">In Progress</th>
                    <th className="px-4 py-3">Done</th>
                    <th className="px-4 py-3">Urgent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {(analytics.allocationsByUser || []).map((row) => (
                    <tr key={row.user_id}>
                      <td className="px-4 py-3">
                        <span className="block font-semibold text-ink">{row.name}</span>
                        <span className="block text-xs text-slate-500">{row.email}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{row.role}</td>
                      <td className="px-4 py-3 font-semibold text-ink">{row.active_assigned_count}</td>
                      <td className="px-4 py-3 text-slate-600">{row.todo_count}</td>
                      <td className="px-4 py-3 text-slate-600">{row.in_progress_count}</td>
                      <td className="px-4 py-3 text-slate-600">{row.done_count}</td>
                      <td className="px-4 py-3 text-slate-600">{row.urgent_active_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default AnalyticsPage;
