import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { hashPassword } from '../../common/utils/auth.util';
import { serializeValue } from '../../common/utils/serialize.util';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';

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
            account: true,
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

  async create(dto: CreateAgentDto) {
    const account = dto.account.trim();
    const password = dto.password.trim();
    const mobile = dto.mobile.trim();

    const exists = await this.prisma.appUser.findFirst({
      where: {
        account,
      },
    });

    if (exists) {
      throw new BadRequestException('登录账号已存在');
    }

    const created = await this.prisma.$transaction(async (tx) => {
      const user = await tx.appUser.create({
        data: {
          role: 'agent',
          account,
          password: hashPassword(password),
          nickname: dto.nickname.trim(),
          mobile,
          avatar: dto.avatar?.trim() || undefined,
          status: dto.status === 1 ? 1 : 0,
        },
      });

      await tx.agentProfile.create({
        data: {
          userId: user.id,
          realName: dto.realName.trim(),
          schoolName: dto.schoolName?.trim() || undefined,
          majorName: dto.majorName?.trim() || undefined,
          gradeName: dto.gradeName?.trim() || undefined,
          inviteCode: dto.inviteCode?.trim() || undefined,
          status: dto.status ?? 0,
        },
      });

      return tx.agentProfile.findUnique({
        where: { userId: user.id },
        include: {
          user: {
            select: {
              id: true,
              account: true,
              nickname: true,
              mobile: true,
              status: true,
            },
          },
        },
      });
    });

    return {
      code: 0,
      message: '创建成功',
      data: serializeValue(created),
    };
  }

  async update(id: number, dto: UpdateAgentDto) {
    const agent = await this.prisma.agentProfile.findUnique({
      where: { id: BigInt(id) },
      include: { user: true },
    });

    if (!agent) {
      throw new NotFoundException('代理不存在');
    }

    const nextAccount = dto.account !== undefined ? dto.account.trim() : agent.user.account || '';
    if (!nextAccount) {
      throw new BadRequestException('代理必须设置登录账号');
    }

    const duplicate = await this.prisma.appUser.findFirst({
      where: {
        account: nextAccount,
        id: {
          not: agent.user.id,
        },
      },
    });

    if (duplicate) {
      throw new BadRequestException('登录账号已存在');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.appUser.update({
        where: { id: agent.userId },
        data: {
          account: nextAccount,
          password: dto.password?.trim() ? hashPassword(dto.password.trim()) : undefined,
          nickname: dto.nickname !== undefined ? dto.nickname.trim() : undefined,
          mobile: dto.mobile !== undefined ? dto.mobile.trim() : undefined,
          avatar: dto.avatar !== undefined ? dto.avatar.trim() || null : undefined,
          status: dto.status === undefined ? undefined : dto.status === 1 ? 1 : 0,
        },
      });

      await tx.agentProfile.update({
        where: { id: agent.id },
        data: {
          realName: dto.realName !== undefined ? dto.realName.trim() : undefined,
          schoolName: dto.schoolName !== undefined ? dto.schoolName.trim() || null : undefined,
          majorName: dto.majorName !== undefined ? dto.majorName.trim() || null : undefined,
          gradeName: dto.gradeName !== undefined ? dto.gradeName.trim() || null : undefined,
          inviteCode: dto.inviteCode !== undefined ? dto.inviteCode.trim() || null : undefined,
          status: dto.status,
        },
      });

      return tx.agentProfile.findUnique({
        where: { id: agent.id },
        include: {
          user: {
            select: {
              id: true,
              account: true,
              nickname: true,
              mobile: true,
              status: true,
            },
          },
        },
      });
    });

    return {
      code: 0,
      message: '更新成功',
      data: serializeValue(updated),
    };
  }

  async delete(id: number) {
    const agent = await this.prisma.agentProfile.findUnique({
      where: { id: BigInt(id) },
    });

    if (!agent) {
      throw new NotFoundException('代理不存在');
    }

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.agentProfile.delete({
          where: { id: agent.id },
        });

        await tx.appUser.delete({
          where: { id: agent.userId },
        });
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new BadRequestException('该代理存在关联业务数据，不能删除');
      }
      throw error;
    }

    return {
      code: 0,
      message: '删除成功',
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

    await this.prisma.appUser.update({
      where: {
        id: agent.userId,
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
