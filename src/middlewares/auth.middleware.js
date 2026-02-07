import logger from '#config/logger.js';
import { jwtToken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';

export const authenticate = (req, res, next) => {
  try {
    logger.info('Authentication middleware triggered');
    const token = cookies.get(req, 'token');

    if (!token) {
      logger.warn('No token found in request');
      return res.status(401).json({ message: 'Authentication required' });
    }

    logger.info('Token found, verifying...');
    const decoded = jwtToken.verify(token);
    req.user = decoded;
    logger.info(`User authenticated: ${decoded.email}`);

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: 'Insufficient permissions to access this resource' });
    }

    next();
  };
};
