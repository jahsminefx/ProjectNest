const { getUserById } = require('../services/auth.service');
const { verifyToken } = require('../utils/jwt');

async function authenticate(req, res, next) {
  const authHeader = req.get('authorization') || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Authentication token is required' });
  }

  try {
    const payload = verifyToken(token);
    const user = await getUserById(payload.sub);

    if (!user) {
      return res.status(401).json({ error: 'Authentication token is no longer valid' });
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Invalid or expired authentication token' });
    }

    return next(error);
  }
}

module.exports = authenticate;
