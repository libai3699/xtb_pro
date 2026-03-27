import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { serializeValue } from '../../common/utils/serialize.util';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { CreateShareDto } from './dto/create-share.dto';
import { VisitShareDto } from './dto/visit-share.dto';

@Injectable()
export class CampaignService {
  constructor(private readonly prisma: PrismaService) {}

  async getAdminList() {
    const list = await this.prisma.campaign.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            leads: true,
            orders: true,
            shares: true,
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

  async create(dto: CreateCampaignDto) {
    const data: Prisma.CampaignCreateInput = {
      title: dto.title,
      campaignType: dto.campaignType,
      targetCount: dto.targetCount,
      location: dto.location,
      cover: dto.cover,
      description: dto.description,
      requirement: dto.requirement,
      formConfig: dto.formConfig as Prisma.InputJsonValue | undefined,
      rewardDesc: dto.rewardDesc,
      startTime: dto.startTime ? new Date(dto.startTime) : undefined,
      endTime: dto.endTime ? new Date(dto.endTime) : undefined,
      status: dto.status ?? 0,
    };

    const campaign = await this.prisma.campaign.create({ data });

    return {
      code: 0,
      message: '创建成功',
      data: serializeValue(campaign),
    };
  }

  async getAppList() {
    const list = await this.prisma.campaign.findMany({
      where: {
        status: 1,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        campaignType: true,
        targetCount: true,
        location: true,
        cover: true,
        description: true,
        requirement: true,
        rewardDesc: true,
        startTime: true,
        endTime: true,
        status: true,
        createdAt: true,
      },
    });

    return {
      code: 0,
      message: 'ok',
      data: serializeValue(list),
    };
  }

  async getDetail(id: number) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: BigInt(id) },
      include: {
        products: {
          where: {
            status: 1,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            leads: true,
            orders: true,
            shares: true,
          },
        },
      },
    });

    if (!campaign) {
      throw new NotFoundException('活动不存在');
    }

    return {
      code: 0,
      message: 'ok',
      data: serializeValue(campaign),
    };
  }

  async createShare(dto: CreateShareDto) {
    const record = await this.ensureCampaignShareRecord(BigInt(dto.campaignId), BigInt(dto.agentUserId), dto.shareUrl?.trim());

    return {
      code: 0,
      message: 'ok',
      data: serializeValue(record),
    };
  }

  async visitShare(dto: VisitShareDto) {
    const record = await this.ensureCampaignShareRecord(BigInt(dto.campaignId), BigInt(dto.agentUserId));
    const updated = await this.prisma.campaignShare.update({
      where: {
        id: record.id,
      },
      data: {
        pv: {
          increment: 1,
        },
        uv: {
          increment: 1,
        },
      },
    });

    return {
      code: 0,
      message: 'ok',
      data: serializeValue(updated),
    };
  }

  async getShareList(userId: number) {
    const list = await this.prisma.campaignShare.findMany({
      where: {
        agentUserId: BigInt(userId),
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        campaign: {
          select: {
            id: true,
            title: true,
            cover: true,
            rewardDesc: true,
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

  async ensureCampaignShareRecord(campaignId: bigint, agentUserId: bigint, shareUrl?: string) {
    const current = await this.prisma.campaignShare.findFirst({
      where: {
        campaignId,
        agentUserId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (current) {
      if (shareUrl && current.shareUrl !== shareUrl) {
        return this.prisma.campaignShare.update({
          where: { id: current.id },
          data: { shareUrl },
        });
      }
      return current;
    }

    return this.prisma.campaignShare.create({
      data: {
        campaignId,
        agentUserId,
        shareCode: `S${Date.now()}${Math.random().toString().slice(2, 8)}`,
        shareUrl,
      },
    });
  }
}
