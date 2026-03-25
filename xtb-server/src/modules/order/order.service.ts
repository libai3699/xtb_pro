import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { serializeValue } from '../../common/utils/serialize.util';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async getAdminList() {
    const list = await this.prisma.order.findMany({
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
        product: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
        agentUser: {
          select: {
            id: true,
            nickname: true,
            mobile: true,
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

  async create(dto: CreateOrderDto) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: BigInt(dto.productId),
      },
    });

    if (!product) {
      throw new NotFoundException('商品不存在');
    }

    const order = await this.prisma.order.create({
      data: {
        orderNo: `XTB${Date.now()}`,
        productId: product.id,
        campaignId: dto.campaignId ? BigInt(dto.campaignId) : product.campaignId,
        agentUserId: dto.agentUserId ? BigInt(dto.agentUserId) : undefined,
        studentUserId: dto.studentUserId ? BigInt(dto.studentUserId) : undefined,
        studentName: dto.studentName,
        mobile: dto.mobile,
        amount: product.price,
        status: 0,
      },
      include: {
        product: true,
      },
    });

    return {
      code: 0,
      message: '创建订单成功',
      data: serializeValue(order),
    };
  }

  async getMyOrders(userId?: number) {
    const list = await this.prisma.order.findMany({
      where: userId
        ? {
            studentUserId: BigInt(userId),
          }
        : undefined,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            price: true,
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
}
