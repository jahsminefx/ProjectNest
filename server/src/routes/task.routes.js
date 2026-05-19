const express = require('express');
const { TASK_STATUSES } = require('../constants/taskStatuses');
const { listTasksByWorkspace, updateTaskStatus } = require('../services/task.service');

const router = express.Router({ mergeParams: true });

router.get('/', async (req, res, next) => {
  try {
    const tasks = await listTasksByWorkspace(req.params.workspaceId);
    res.json({ statuses: TASK_STATUSES, tasks });
  } catch (error) {
    next(error);
  }
});

router.patch('/:taskId/status', async (req, res, next) => {
  try {
    const task = await updateTaskStatus(
      req.params.workspaceId,
      req.params.taskId,
      req.body.status
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found in this workspace' });
    }

    return res.json({ task });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
