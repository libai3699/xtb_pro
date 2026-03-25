import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { serializeValue } from '../../common/utils/serialize.util';
import { CreateLeadDto } from './dto/create-lead.dto';

@Injectable()
export class LeadService {
  constructor(private readonly prisma: PrismaService) {}

  async getList() {
    const list = await this.prisma.lead.findMany({
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

  async submit(dto: CreateLeadDto) {
    const lead = await this.prisma.lead.create({
      data: {
        campaignId: BigInt(dto.campaignId),
        agentUserId: dto.agentUserId ? BigInt(dto.agentUserId) : undefined,
        name: dto.name,
        mobile: dto.mobile,
        schoolName: dto.schoolName,
        majorName: dto.majorName,
        gradeName: dto.gradeName,
        remark: dto.remark,
        status: 0,
      },
    });

    return {
      code: 0,
      message: '提交成功',
      data: serializeValue(lead),
    };
  }
}
