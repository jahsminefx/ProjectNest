const express = require('express');
const requireWorkspaceMember = require('../middleware/requireWorkspaceMember');
const { listWorkspacesForUser, getWorkspaceById } = require('../services/workspace.service');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const workspaces = await listWorkspacesForUser(req.user.id);
    res.json({ workspaces });
  } catch (error) {
    next(error);
  }
});

router.get('/:workspaceId', requireWorkspaceMember, async (req, res, next) => {
  try {
    const workspace = await getWorkspaceById(req.params.workspaceId);

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    return res.json({ workspace });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
