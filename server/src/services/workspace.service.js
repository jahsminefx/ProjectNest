const db = require('../config/db');

async function listWorkspacesForUser(userId) {
  const result = await db.query(
    `SELECT
      w.id,
      w.name,
      w.slug,
      w.owner_id,
      m.role,
      COUNT(t.id)::INTEGER AS task_count,
      COUNT(t.id) FILTER (WHERE t.status = 'DONE')::INTEGER AS completed_task_count
    FROM workspaces w
    INNER JOIN memberships m ON m.workspace_id = w.id
    LEFT JOIN tasks t ON t.workspace_id = w.id
    WHERE m.user_id = $1
    GROUP BY w.id, m.role
    ORDER BY w.created_at ASC`,
    [userId]
  );

  return result.rows;
}

async function getWorkspaceById(workspaceId) {
  const result = await db.query(
    `SELECT
      w.id,
      w.name,
      w.slug,
      w.owner_id,
      COUNT(DISTINCT m.user_id)::INTEGER AS member_count
    FROM workspaces w
    LEFT JOIN memberships m ON m.workspace_id = w.id
    WHERE w.id = $1
    GROUP BY w.id`,
    [workspaceId]
  );

  return result.rows[0] || null;
}

module.exports = {
  listWorkspacesForUser,
  getWorkspaceById
};
