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

    const campaignId = dto.campaignId ? BigInt(dto.campaignId) : product.campaignId;
    const agentUserId = dto.agentUserId ? BigInt(dto.agentUserId) : undefined;

    const order = await this.prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNo: `XTB${Date.now()}`,
          productId: product.id,
          campaignId,
          agentUserId,
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

      if (agentUserId) {
        const share = await tx.campaignShare.findFirst({
          where: {
            campaignId,
            agentUserId,
          },
        });

        if (share) {
          await tx.campaignShare.update({
            where: { id: share.id },
            data: {
              orderCount: {
                increment: 1,
              },
            },
          });
        } else {
          await tx.campaignShare.create({
            data: {
              campaignId,
              agentUserId,
              shareCode: `S${Date.now()}${Math.random().toString().slice(2, 8)}`,
              orderCount: 1,
            },
          });
        }
      }

      return created;
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
