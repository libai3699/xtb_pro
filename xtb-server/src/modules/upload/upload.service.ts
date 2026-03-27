import { Injectable } from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class UploadService {
  getFileUrl(req: Request, relativePath: string) {
    const configuredBaseUrl = process.env.FILE_BASE_URL?.trim();
    if (configuredBaseUrl) {
      return `${configuredBaseUrl.replace(/\/+$/, '')}/${relativePath.replace(/\\/g, '/')}`;
    }

    const forwardedProto = req.headers['x-forwarded-proto'];
    const protocol =
      typeof forwardedProto === 'string' && forwardedProto.trim()
        ? forwardedProto.split(',')[0].trim()
        : req.protocol;
    const host = req.get('host');

    return `${protocol}://${host}/${relativePath.replace(/\\/g, '/')}`;
  }
}
