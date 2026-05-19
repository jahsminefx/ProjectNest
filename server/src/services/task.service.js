const db = require('../config/db');
const { TASK_STATUS_IDS } = require('../constants/taskStatuses');

async function listTasksByWorkspace(workspaceId) {
  const result = await db.query(
    `SELECT
      t.id,
      t.workspace_id,
      t.project_id,
      p.name AS project_name,
      t.title,
      t.description,
      t.status,
      t.priority,
      t.assignee_id,
      u.name AS assignee_name,
      t.attachment_url,
      t.completed_at,
      t.created_at,
      t.updated_at
    FROM tasks t
    LEFT JOIN projects p ON p.id = t.project_id AND p.workspace_id = t.workspace_id
    LEFT JOIN users u ON u.id = t.assignee_id
    WHERE t.workspace_id = $1
    ORDER BY
      CASE t.priority
        WHEN 'URGENT' THEN 1
        WHEN 'HIGH' THEN 2
        WHEN 'MEDIUM' THEN 3
        ELSE 4
      END,
      t.created_at ASC`,
    [workspaceId]
  );

  return result.rows;
}

async function updateTaskStatus(workspaceId, taskId, status) {
  if (!TASK_STATUS_IDS.includes(status)) {
    const error = new Error('Invalid task status');
    error.status = 400;
    throw error;
  }

  const result = await db.query(
    `UPDATE tasks
    SET
      status = $3,
      completed_at = CASE
        WHEN $3 = 'DONE' THEN COALESCE(completed_at, NOW())
        ELSE NULL
      END
    WHERE workspace_id = $1 AND id = $2
    RETURNING
      id,
      workspace_id,
      project_id,
      title,
      description,
      status,
      priority,
      assignee_id,
      attachment_url,
      completed_at,
      created_at,
      updated_at`,
    [workspaceId, taskId, status]
  );

  return result.rows[0] || null;
}

module.exports = {
  listTasksByWorkspace,
  updateTaskStatus
};
