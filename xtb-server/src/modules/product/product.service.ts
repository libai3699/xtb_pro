import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { serializeValue } from '../../common/utils/serialize.util';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getAdminList() {
    const list = await this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        campaign: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return {
      code: 0,
      message: 'ok',
      data: serializeValue(list),
    };
  }

  async create(dto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: {
        campaignId: BigInt(dto.campaignId),
        title: dto.title,
        price: dto.price,
        originalPrice: dto.originalPrice,
        cover: dto.cover,
        description: dto.description,
        status: 1,
      },
    });

    return {
      code: 0,
      message: '创建成功',
      data: serializeValue(product),
    };
  }

  async getAppList(campaignId?: number) {
    const list = await this.prisma.product.findMany({
      where: {
        status: 1,
        ...(campaignId ? { campaignId: BigInt(campaignId) } : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      code: 0,
      message: 'ok',
      data: serializeValue(list),
    };
  }
}

