function authenticate(req, res, next) {
  return res.status(501).json({
    error: 'Authentication middleware will be implemented after Phase 1 confirmation.'
  });
}

module.exports = authenticate;
