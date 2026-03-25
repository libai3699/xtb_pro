import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { serializeValue } from '../../common/utils/serialize.util';
import { CreateCampaignDto } from './dto/create-campaign.dto';

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
      cover: dto.cover,
      description: dto.description,
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
        cover: true,
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
}
