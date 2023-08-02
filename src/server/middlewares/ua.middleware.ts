import type { Request, Response, NextFunction } from 'express';
import UAParser from 'ua-parser-js';

/**
 * Make device type available to views
 */
export const UA = (req: Request, res: Response, next: NextFunction) => {
  const ua = UAParser(req.headers['user-agent']);

  res.locals.isDesktop = ua.device.type === undefined;
  res.locals.isPhone = ua.device.type === 'mobile';
  res.locals.isTablet = ua.device.type === 'tablet';

  next();
};
