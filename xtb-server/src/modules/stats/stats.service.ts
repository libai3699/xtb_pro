import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { serializeValue } from '../../common/utils/serialize.util';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview() {
    const [campaignCount, agentCount, leadCount, orderCount, paidAgg] = await Promise.all([
      this.prisma.campaign.count(),
      this.prisma.agentProfile.count({
        where: {
          status: 1,
        },
      }),
      this.prisma.lead.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        where: {
          status: 1,
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
        campaignCount,
        agentCount,
        leadCount,
        orderCount,
        paidAmount: serializeValue(paidAgg._sum.amount ?? 0),
      },
    };
  }
}
