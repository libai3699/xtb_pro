import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import type { Request } from 'express';
import { existsSync, mkdirSync } from 'node:fs';
import { extname, resolve } from 'node:path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UploadService } from './upload.service';

const uploadRoot = resolve(__dirname, '..', '..', '..', 'uploads', 'images');

function ensureUploadDir() {
  mkdirSync(uploadRoot, { recursive: true });
  return uploadRoot;
}

function randomName(originalName: string) {
  const ext = extname(originalName || '').toLowerCase();
  const safeExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext) ? ext : '.jpg';
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${safeExt}`;
}

@ApiTags('upload')
@Controller()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({ summary: '查看上传目录配置' })
  @Get('admin/upload/debug')
  getUploadDebug() {
    return {
      code: 0,
      message: 'ok',
      data: {
        uploadRoot,
        exists: existsSync(uploadRoot),
        fileBaseUrl: process.env.FILE_BASE_URL || '',
      },
    };
  }

  @ApiOperation({ summary: '后台上传图片' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('admin/upload/image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          cb(null, ensureUploadDir());
        },
        filename: (_req, file, cb) => {
          cb(null, randomName(file.originalname));
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (_req, file, cb) => {
        const ext = extname(file.originalname || '').toLowerCase();
        const mime = (file.mimetype || '').toLowerCase();
        const allowExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const allowMime = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        if (!allowExt.includes(ext) || !allowMime.includes(mime)) {
          cb(new BadRequestException('仅支持 jpg、png、gif、webp 图片'), false);
          return;
        }

        cb(null, true);
      },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File | undefined, @Req() req: Request) {
    if (!file) {
      throw new BadRequestException('请先选择图片文件');
    }

    const relativePath = `uploads/images/${file.filename}`;

    return {
      code: 0,
      message: '上传成功',
      data: {
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        path: relativePath,
        diskPath: resolve(uploadRoot, file.filename),
        url: this.uploadService.getFileUrl(req, relativePath),
      },
    };
  }

  @ApiOperation({ summary: '客户端上传图片' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('app/upload/image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          cb(null, ensureUploadDir());
        },
        filename: (_req, file, cb) => {
          cb(null, randomName(file.originalname));
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (_req, file, cb) => {
        const ext = extname(file.originalname || '').toLowerCase();
        const mime = (file.mimetype || '').toLowerCase();
        const allowExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const allowMime = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        if (!allowExt.includes(ext) || !allowMime.includes(mime)) {
          cb(new BadRequestException('仅支持 jpg、png、gif、webp 图片'), false);
          return;
        }

        cb(null, true);
      },
    }),
  )
  uploadAppImage(@UploadedFile() file: Express.Multer.File | undefined, @Req() req: Request) {
    return this.uploadImage(file, req);
  }
}
