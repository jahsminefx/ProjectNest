const express = require('express');
const { listWorkspaces, getWorkspaceById } = require('../services/workspace.service');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const workspaces = await listWorkspaces();
    res.json({ workspaces });
  } catch (error) {
    next(error);
  }
});

router.get('/:workspaceId', async (req, res, next) => {
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
