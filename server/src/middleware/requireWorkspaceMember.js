function requireWorkspaceMember(req, res, next) {
  return res.status(501).json({
    error: 'Workspace isolation middleware will be implemented after Phase 1 confirmation.'
  });
}

module.exports = requireWorkspaceMember;
