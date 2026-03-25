import type { Request } from 'express';

export function getRequestIp(req: Request) {
  const forwarded = req.headers['x-forwarded-for'];
  const forwardedIp = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0];
  const rawIp = forwardedIp || req.ip || req.socket.remoteAddress || '';
  return rawIp.replace('::ffff:', '');
}

export function getRequestUserAgent(req: Request) {
  const ua = req.headers['user-agent'];
  return Array.isArray(ua) ? ua.join('; ') : ua || '';
}

