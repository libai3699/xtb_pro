import { createHash } from 'node:crypto';

export function hashPassword(password: string) {
  return createHash('sha256').update(password).digest('hex');
}

export function verifyPassword(password: string, storedPassword: string) {
  return storedPassword === password || storedPassword === hashPassword(password);
}

