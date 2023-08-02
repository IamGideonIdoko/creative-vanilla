import rateLimit from 'express-rate-limit';
import type { RateLimitRequestHandler } from 'express-rate-limit';

export const limiter = (maxNumOfRequests = 100, timeToReEntry = 2): RateLimitRequestHandler =>
  rateLimit({
    windowMs: timeToReEntry * 60000, // 30000ms = 30s = 0.5m
    max: maxNumOfRequests, // limit each IP to 100 requests per windowMs
  });
