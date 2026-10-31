const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/constants');
const dbStore = require('../models/dbStore');

async function authMiddleware(req, res, next) {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. No bearer token provided.'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await dbStore.findUserById(decoded.userId);

    if (!user || user.account_status !== 'active') {
      return res.status(401).json({
        success: false,
        error: 'User account is inactive or no longer exists.'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired session token. Please log in again.'
    });
  }
}

module.exports = authMiddleware;
