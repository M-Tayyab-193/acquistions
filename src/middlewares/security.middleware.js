import aj from '#config/arcjet.js';
import logger from '#config/logger.js';
import { slidingWindow } from '@arcjet/node';

const securityMiddleware = async (req, res, next) => {
  try {
    const role = req.user?.role || 'guest';

    let limit, message;

    switch (role) {
      case 'admin':
        limit = 20; // 20 requests per interval for admins
        message = 'Admin rate limit exceeded (20 requests per minute)';
        break;
      case 'user':
        limit = 10; // 10 requests per interval for regular users
        message = 'User rate limit exceeded (10 requests per minute)';
        break;
      default:
        limit = 5; // 5 requests per interval for guests
        message = 'Guest rate limit exceeded (5 requests per minute)';
    }

    const client = aj.withRule(
      slidingWindow({
        mode: 'LIVE',
        interval: '1m',
        max: limit,
        name: `Rate limit for ${role}s`,
      })
    );

    const decision = await client.protect(req);

    if (decision.isDenied() && decision.reason.isBot()) {
      logger.warn(`Blocked bot request`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
      });
      res.status(403).json({ message: 'Access denied for bots' });
      return;
    }

    if (decision.isDenied() && decision.reason.isShield()) {
      logger.warn(`Shield Blocked request`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        method: req.method,
      });
      res.status(403).json({ message: 'Request blocked by security shield' });
      return;
    }
    if (decision.isDenied() && decision.reason.isRateLimit()) {
      logger.warn(`Rate limit exceeded`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        method: req.method,
      });
      res
        .status(403)
        .json({ message: 'Too many requests. Please try again later.' });
      return;
    }

    next();
  } catch (error) {
    logger.error('Security middleware error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default securityMiddleware;
