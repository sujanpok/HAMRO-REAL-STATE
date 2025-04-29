// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
const logger = require('../logger');

// Middleware to authenticate JWT token
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // If Authorization header is missing
  if (!authHeader) {
    logger.warn('Authorization header missing');
    return res.status(403).json({ error: 'Access denied, no token provided' });
  }

  // Check if the header starts with 'Bearer '
  if (!authHeader.startsWith('Bearer ')) {
    logger.warn('Authorization header is malformed');
    return res.status(403).json({ error: 'Invalid authorization header format' });
  }

  // Extract the token from the header
  const token = authHeader.split(' ')[1];

  // Log JWT secret (for debugging, remove in production)
  logger.info(`JWT_SECRET: ${process.env.JWT_SECRET}`);

  // Verify JWT token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      logger.warn(`JWT verification failed: ${err.message}`);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    req.user = user; // Attach user data to request
    next(); // Proceed to next middleware or route
  });
};

module.exports = { authenticateJWT };
