const db = require('../config/db');

const EDITABLE_ROLES = ['admin', 'member', 'viewer'];

async function getMembership(userId, workspaceId) {
  const result = await db.query(
    `SELECT user_id, workspace_id, role
    FROM memberships
    WHERE user_id = $1 AND workspace_id = $2`,
    [userId, workspaceId]
  );

  return result.rows[0] || null;
}

async function listWorkspaceMembers(workspaceId) {
  const result = await db.query(
    `SELECT
      u.id,
      u.name,
      u.email,
      m.role,
      m.created_at AS joined_at,
      COUNT(t.id) FILTER (WHERE t.status != 'DONE')::INTEGER AS active_task_count
    FROM memberships m
    INNER JOIN users u ON u.id = m.user_id
    LEFT JOIN tasks t ON t.workspace_id = m.workspace_id AND t.assignee_id = m.user_id
    WHERE m.workspace_id = $1
    GROUP BY u.id, u.name, u.email, m.role, m.created_at
    ORDER BY
      CASE m.role
        WHEN 'owner' THEN 1
        WHEN 'admin' THEN 2
        WHEN 'member' THEN 3
        ELSE 4
      END,
      u.name ASC`,
    [workspaceId]
  );

  return result.rows;
}

async function updateMemberRole(workspaceId, userId, role) {
  if (!EDITABLE_ROLES.includes(role)) {
    const error = new Error('Role must be admin, member, or viewer');
    error.status = 400;
    throw error;
  }

  const result = await db.query(
    `UPDATE memberships m
    SET role = $3
    FROM workspaces w
    WHERE m.workspace_id = w.id
      AND m.workspace_id = $1
      AND m.user_id = $2
      AND w.owner_id != m.user_id
    RETURNING m.user_id, m.workspace_id, m.role`,
    [workspaceId, userId, role]
  );

  return result.rows[0] || null;
}

module.exports = {
  getMembership,
  listWorkspaceMembers,
  updateMemberRole
};
