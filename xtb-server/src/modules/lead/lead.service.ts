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
    const campaignId = BigInt(dto.campaignId);
    const agentUserId = dto.agentUserId ? BigInt(dto.agentUserId) : undefined;

    const lead = await this.prisma.$transaction(async (tx) => {
      const created = await tx.lead.create({
        data: {
          campaignId,
          agentUserId,
          studentUserId: dto.studentUserId ? BigInt(dto.studentUserId) : undefined,
          name: dto.name,
          mobile: dto.mobile,
          schoolName: dto.schoolName,
          majorName: dto.majorName,
          gradeName: dto.gradeName,
          remark: dto.remark,
          status: 0,
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
              leadCount: {
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
              leadCount: 1,
            },
          });
        }
      }

      return created;
    });

    return {
      code: 0,
      message: '提交成功',
      data: serializeValue(lead),
    };
  }
}
