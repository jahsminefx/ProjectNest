const db = require('../config/db');

async function getWorkspaceAnalytics(workspaceId) {
  const summaryResult = await db.query(
    `SELECT
      COUNT(*) FILTER (
        WHERE status = 'DONE'
          AND completed_at >= NOW() - INTERVAL '30 days'
      )::INTEGER AS team_velocity_30_days,
      COUNT(*) FILTER (WHERE status = 'DONE')::INTEGER AS total_completed_tasks,
      COUNT(*) FILTER (WHERE status != 'DONE')::INTEGER AS active_backlog_items,
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days')::INTEGER AS tasks_created_30_days,
      COALESCE(
        ROUND(
          AVG(EXTRACT(EPOCH FROM (completed_at - created_at)) / 86400)
          FILTER (WHERE completed_at IS NOT NULL),
          2
        ),
        0
      )::NUMERIC AS average_cycle_time_days
    FROM tasks
    WHERE workspace_id = $1`,
    [workspaceId]
  );

  const velocityResult = await db.query(
    `SELECT
      DATE_TRUNC('week', completed_at)::DATE AS week_start,
      COUNT(*)::INTEGER AS completed_count
    FROM tasks
    WHERE workspace_id = $1
      AND status = 'DONE'
      AND completed_at >= NOW() - INTERVAL '8 weeks'
    GROUP BY DATE_TRUNC('week', completed_at)
    ORDER BY week_start ASC`,
    [workspaceId]
  );

  const backlogResult = await db.query(
    `SELECT
      status,
      COUNT(*)::INTEGER AS count
    FROM tasks
    WHERE workspace_id = $1
      AND status != 'DONE'
    GROUP BY status
    ORDER BY status ASC`,
    [workspaceId]
  );

  const allocationsResult = await db.query(
    `SELECT
      u.id AS user_id,
      u.name,
      u.email,
      m.role,
      COUNT(t.id) FILTER (WHERE t.status != 'DONE')::INTEGER AS active_assigned_count,
      COUNT(t.id) FILTER (WHERE t.status = 'TODO')::INTEGER AS todo_count,
      COUNT(t.id) FILTER (WHERE t.status = 'IN_PROGRESS')::INTEGER AS in_progress_count,
      COUNT(t.id) FILTER (WHERE t.status = 'DONE')::INTEGER AS done_count,
      COUNT(t.id) FILTER (WHERE t.priority = 'URGENT' AND t.status != 'DONE')::INTEGER AS urgent_active_count
    FROM memberships m
    INNER JOIN users u ON u.id = m.user_id
    LEFT JOIN tasks t
      ON t.workspace_id = m.workspace_id
      AND t.assignee_id = m.user_id
    WHERE m.workspace_id = $1
    GROUP BY u.id, u.name, u.email, m.role
    ORDER BY active_assigned_count DESC, u.name ASC`,
    [workspaceId]
  );

  return {
    summary: summaryResult.rows[0],
    velocityByWeek: velocityResult.rows,
    backlogByStatus: backlogResult.rows,
    allocationsByUser: allocationsResult.rows
  };
}

module.exports = {
  getWorkspaceAnalytics
};
