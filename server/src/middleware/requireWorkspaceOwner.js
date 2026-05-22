function requireWorkspaceOwner(req, res, next) {
  if (!req.membership) {
    return res.status(403).json({ error: 'Forbidden: workspace membership required' });
  }

  if (req.membership.role !== 'owner') {
    return res.status(403).json({ error: 'Forbidden: workspace owner role required' });
  }

  return next();
}

module.exports = requireWorkspaceOwner;
