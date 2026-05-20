const { getMembership } = require('../services/membership.service');

function getWorkspaceId(req) {
  return (
    req.params.workspaceId ||
    req.query.workspaceId ||
    req.body?.workspaceId ||
    req.body?.workspace_id ||
    req.get('x-workspace-id')
  );
}

async function requireWorkspaceMember(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication is required' });
  }

  const workspaceId = getWorkspaceId(req);

  if (!workspaceId) {
    return res.status(400).json({ error: 'workspaceId is required' });
  }

  try {
    const membership = await getMembership(req.user.id, workspaceId);

    if (!membership) {
      return res.status(403).json({ error: 'Forbidden: workspace membership required' });
    }

    req.workspaceId = workspaceId;
    req.membership = membership;
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = requireWorkspaceMember;
