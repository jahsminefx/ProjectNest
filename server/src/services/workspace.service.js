const db = require('../config/db');

async function listWorkspaces() {
  const result = await db.query(
    `SELECT
      w.id,
      w.name,
      w.slug,
      w.owner_id,
      COUNT(t.id)::INTEGER AS task_count,
      COUNT(t.id) FILTER (WHERE t.status = 'DONE')::INTEGER AS completed_task_count
    FROM workspaces w
    LEFT JOIN tasks t ON t.workspace_id = w.id
    GROUP BY w.id
    ORDER BY w.created_at ASC`
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
  listWorkspaces,
  getWorkspaceById
};
