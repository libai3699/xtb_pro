import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { serializeValue } from '../../common/utils/serialize.util';
import { SaveContentArticleDto } from './dto/save-content-article.dto';

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  async getAdminList(type?: string) {
    const list = await this.prisma.contentArticle.findMany({
      where: {
        ...(type ? { type } : {}),
      },
      orderBy: [{ sort: 'desc' }, { createdAt: 'desc' }],
    });

    return {
      code: 0,
      message: 'ok',
      data: serializeValue(list),
    };
  }

  async create(dto: SaveContentArticleDto) {
    const created = await this.prisma.contentArticle.create({
      data: {
        type: dto.type,
        title: dto.title.trim(),
        summary: dto.summary?.trim() || undefined,
        cover: dto.cover?.trim() || undefined,
        category: dto.category?.trim() || undefined,
        content: dto.content?.trim() || undefined,
        sort: dto.sort ?? 0,
        status: dto.status ?? 1,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
      },
    });

    return {
      code: 0,
      message: '创建成功',
      data: serializeValue(created),
    };
  }

  async update(id: number, dto: SaveContentArticleDto) {
    const current = await this.prisma.contentArticle.findUnique({
      where: { id: BigInt(id) },
    });

    if (!current) {
      throw new NotFoundException('内容不存在');
    }

    const updated = await this.prisma.contentArticle.update({
      where: { id: current.id },
      data: {
        type: dto.type,
        title: dto.title.trim(),
        summary: dto.summary?.trim() || null,
        cover: dto.cover?.trim() || null,
        category: dto.category?.trim() || null,
        content: dto.content?.trim() || null,
        sort: dto.sort ?? current.sort,
        status: dto.status ?? current.status,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : null,
      },
    });

    return {
      code: 0,
      message: '更新成功',
      data: serializeValue(updated),
    };
  }

  async delete(id: number) {
    await this.prisma.contentArticle.delete({
      where: { id: BigInt(id) },
    });

    return {
      code: 0,
      message: '删除成功',
    };
  }

  async getAppList(type: 'news' | 'help') {
    const list = await this.prisma.contentArticle.findMany({
      where: {
        type,
        status: 1,
      },
      orderBy: [{ sort: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
    });

    return {
      code: 0,
      message: 'ok',
      data: serializeValue(list),
    };
  }

  async getDetail(id: number) {
    const detail = await this.prisma.contentArticle.findUnique({
      where: { id: BigInt(id) },
    });

    if (!detail) {
      throw new NotFoundException('内容不存在');
    }

    return {
      code: 0,
      message: 'ok',
      data: serializeValue(detail),
    };
  }
}
