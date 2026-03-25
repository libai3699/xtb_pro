import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { serializeValue } from '../../common/utils/serialize.util';

@Injectable()
export class AgentService {
  constructor(private readonly prisma: PrismaService) {}

  async getAdminList() {
    const list = await this.prisma.agentProfile.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            mobile: true,
            status: true,
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

  async audit(id: number) {
    const agent = await this.prisma.agentProfile.findUnique({
      where: {
        id: BigInt(id),
      },
    });

    if (!agent) {
      throw new NotFoundException('代理不存在');
    }

    const updated = await this.prisma.agentProfile.update({
      where: {
        id: agent.id,
      },
      data: {
        status: 1,
      },
    });

    return {
      code: 0,
      message: '审核成功',
      data: serializeValue(updated),
    };
  }

  async getMyStats(userId?: number) {
    const where = userId
      ? {
          agentUserId: BigInt(userId),
        }
      : undefined;

    const [shareAgg, leadCount, orderAgg] = await Promise.all([
      this.prisma.campaignShare.aggregate({
        where,
        _sum: {
          pv: true,
          uv: true,
          leadCount: true,
          orderCount: true,
        },
      }),
      this.prisma.lead.count({
        where,
      }),
      this.prisma.order.aggregate({
        where,
        _count: {
          id: true,
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    return {
      code: 0,
      message: 'ok',
      data: {
        pv: shareAgg._sum.pv ?? 0,
        uv: shareAgg._sum.uv ?? 0,
        leadCount,
        orderCount: orderAgg._count.id ?? 0,
        shareLeadCount: shareAgg._sum.leadCount ?? 0,
        shareOrderCount: shareAgg._sum.orderCount ?? 0,
        paidAmount: serializeValue(orderAgg._sum.amount ?? 0),
      },
    };
  }
}
