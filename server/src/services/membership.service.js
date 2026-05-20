const db = require('../config/db');

async function getMembership(userId, workspaceId) {
  const result = await db.query(
    `SELECT user_id, workspace_id, role
    FROM memberships
    WHERE user_id = $1 AND workspace_id = $2`,
    [userId, workspaceId]
  );

  return result.rows[0] || null;
}

module.exports = {
  getMembership
};
