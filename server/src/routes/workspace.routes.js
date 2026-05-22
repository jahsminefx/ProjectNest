const express = require('express');
const requireWorkspaceMember = require('../middleware/requireWorkspaceMember');
const requireWorkspaceOwner = require('../middleware/requireWorkspaceOwner');
const { getWorkspaceAnalytics } = require('../services/analytics.service');
const { listWorkspaceMembers, updateMemberRole } = require('../services/membership.service');
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

router.get('/:workspaceId/analytics', requireWorkspaceMember, async (req, res, next) => {
  try {
    const analytics = await getWorkspaceAnalytics(req.params.workspaceId);
    return res.json({ analytics });
  } catch (error) {
    return next(error);
  }
});

router.get('/:workspaceId/members', requireWorkspaceMember, requireWorkspaceOwner, async (req, res, next) => {
  try {
    const members = await listWorkspaceMembers(req.params.workspaceId);
    return res.json({ members });
  } catch (error) {
    return next(error);
  }
});

router.patch(
  '/:workspaceId/members/:userId',
  requireWorkspaceMember,
  requireWorkspaceOwner,
  async (req, res, next) => {
    try {
      const membership = await updateMemberRole(
        req.params.workspaceId,
        req.params.userId,
        req.body.role
      );

      if (!membership) {
        return res.status(404).json({ error: 'Editable workspace member not found' });
      }

      return res.json({ membership });
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;
