import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { serializeValue } from '../../common/utils/serialize.util';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { RedeemRewardDto } from './dto/redeem-reward.dto';
import { SaveRewardGoodsDto } from './dto/save-reward-goods.dto';
import { ToggleFavoriteDto } from './dto/toggle-favorite.dto';

@Injectable()
export class GrowthService {
  constructor(private readonly prisma: PrismaService) {}

  async getAdminRewardGoodsList() {
    const list = await this.prisma.rewardGoods.findMany({
      orderBy: [{ sort: 'desc' }, { createdAt: 'desc' }],
    });

    return {
      code: 0,
      message: 'ok',
      data: serializeValue(list),
    };
  }

  async createRewardGoods(dto: SaveRewardGoodsDto) {
    const created = await this.prisma.rewardGoods.create({
      data: {
        title: dto.title.trim(),
        cover: dto.cover?.trim() || undefined,
        points: dto.points ?? 0,
        stock: dto.stock ?? 0,
        description: dto.description?.trim() || undefined,
        sort: dto.sort ?? 0,
        status: dto.status ?? 1,
      },
    });

    return {
      code: 0,
      message: '创建成功',
      data: serializeValue(created),
    };
  }

  async getAdminRedeemOrderList() {
    const list = await this.prisma.rewardRedeemOrder.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            account: true,
            mobile: true,
          },
        },
        goods: true,
      },
    });

    return {
      code: 0,
      message: 'ok',
      data: serializeValue(list),
    };
  }

  async updateRedeemOrderStatus(id: number, status: number) {
    const updated = await this.prisma.rewardRedeemOrder.update({
      where: {
        id: BigInt(id),
      },
      data: {
        status,
      },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            account: true,
          },
        },
        goods: true,
      },
    });

    return {
      code: 0,
      message: '更新成功',
      data: serializeValue(updated),
    };
  }

  async getAdminMessageList(userId?: number) {
    const list = await this.prisma.userMessage.findMany({
      where: {
        ...(userId ? { userId: BigInt(userId) } : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            account: true,
            role: true,
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

  async createMessage(dto: CreateMessageDto) {
    const created = await this.prisma.userMessage.create({
      data: {
        userId: BigInt(dto.userId),
        type: dto.type?.trim() || 'system',
        title: dto.title.trim(),
        content: dto.content.trim(),
        bizType: dto.bizType?.trim() || undefined,
        bizId: dto.bizId ? BigInt(dto.bizId) : undefined,
        isRead: 0,
      },
    });

    return {
      code: 0,
      message: '创建成功',
      data: serializeValue(created),
    };
  }

  async getAdminCertificateList(userId?: number) {
    const list = await this.prisma.userCertificate.findMany({
      where: {
        ...(userId ? { userId: BigInt(userId) } : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            account: true,
          },
        },
        product: {
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

  async createCertificate(dto: CreateCertificateDto) {
    const created = await this.prisma.userCertificate.create({
      data: {
        userId: BigInt(dto.userId),
        productId: dto.productId ? BigInt(dto.productId) : undefined,
        title: dto.title.trim(),
        issuer: dto.issuer?.trim() || undefined,
        cover: dto.cover?.trim() || undefined,
        fileUrl: dto.fileUrl?.trim() || undefined,
        issuedAt: dto.issuedAt ? new Date(dto.issuedAt) : undefined,
        status: dto.status ?? 1,
      },
    });

    return {
      code: 0,
      message: '创建成功',
      data: serializeValue(created),
    };
  }

  async getAdminLearningRecordList(userId?: number) {
    const list = await this.prisma.learningRecord.findMany({
      where: {
        ...(userId ? { userId: BigInt(userId) } : {}),
      },
      orderBy: [{ lastStudyAt: 'desc' }, { createdAt: 'desc' }],
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            account: true,
          },
        },
        product: {
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

  async getAdminFeedbackList() {
    const list = await this.prisma.userFeedback.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            account: true,
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

  async getAdminAgentReviewList() {
    const list = await this.prisma.agentReview.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        agentUser: {
          select: {
            id: true,
            nickname: true,
            account: true,
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

  async getRewardOverview(userId: number) {
    const [pointAgg, goodsList, redeemCount, unreadMessageCount] = await Promise.all([
      this.prisma.pointRecord.aggregate({
        where: {
          userId: BigInt(userId),
        },
        _sum: {
          changeValue: true,
        },
      }),
      this.prisma.rewardGoods.findMany({
        where: {
          status: 1,
        },
        orderBy: [{ sort: 'desc' }, { createdAt: 'desc' }],
        take: 6,
      }),
      this.prisma.rewardRedeemOrder.count({
        where: {
          userId: BigInt(userId),
        },
      }),
      this.prisma.userMessage.count({
        where: {
          userId: BigInt(userId),
          isRead: 0,
        },
      }),
    ]);

    return {
      code: 0,
      message: 'ok',
      data: {
        points: pointAgg._sum.changeValue ?? 0,
        redeemCount,
        unreadMessageCount,
        goodsList: serializeValue(goodsList),
      },
    };
  }

  async getRewardGoodsList() {
    const list = await this.prisma.rewardGoods.findMany({
      where: {
        status: 1,
      },
      orderBy: [{ sort: 'desc' }, { createdAt: 'desc' }],
    });

    return {
      code: 0,
      message: 'ok',
      data: serializeValue(list),
    };
  }

  async getPointRecordList(userId: number) {
    const list = await this.prisma.pointRecord.findMany({
      where: {
        userId: BigInt(userId),
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

  async getRedeemOrderList(userId: number) {
    const list = await this.prisma.rewardRedeemOrder.findMany({
      where: {
        userId: BigInt(userId),
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        goods: true,
      },
    });

    return {
      code: 0,
      message: 'ok',
      data: serializeValue(list),
    };
  }

  async redeemReward(dto: RedeemRewardDto) {
    const userId = BigInt(dto.userId);
    const goodsId = BigInt(dto.goodsId);

    const [goods, pointAgg] = await Promise.all([
      this.prisma.rewardGoods.findUnique({
        where: { id: goodsId },
      }),
      this.prisma.pointRecord.aggregate({
        where: {
          userId,
        },
        _sum: {
          changeValue: true,
        },
      }),
    ]);

    if (!goods || goods.status !== 1) {
      throw new NotFoundException('兑换商品不存在');
    }

    if (goods.stock <= 0) {
      throw new BadRequestException('兑换商品库存不足');
    }

    const currentPoints = pointAgg._sum.changeValue ?? 0;
    if (currentPoints < goods.points) {
      throw new BadRequestException('积分不足');
    }

    const orderNo = `RG${Date.now()}${Math.random().toString().slice(2, 6)}`;

    const created = await this.prisma.$transaction(async (tx) => {
      const redeemOrder = await tx.rewardRedeemOrder.create({
        data: {
          orderNo,
          userId,
          goodsId,
          points: goods.points,
          status: 0,
        },
      });

      await tx.rewardGoods.update({
        where: { id: goods.id },
        data: {
          stock: {
            decrement: 1,
          },
        },
      });

      await tx.pointRecord.create({
        data: {
          userId,
          type: 'redeem',
          changeValue: -goods.points,
          balanceValue: currentPoints - goods.points,
          remark: `兑换商品：${goods.title}`,
          bizType: 'reward_redeem_order',
          bizId: redeemOrder.id,
        },
      });

      return redeemOrder;
    });

    return {
      code: 0,
      message: '兑换成功',
      data: serializeValue(created),
    };
  }

  async getMessageList(userId: number) {
    const list = await this.prisma.userMessage.findMany({
      where: {
        userId: BigInt(userId),
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

  async readMessage(id: number) {
    const updated = await this.prisma.userMessage.update({
      where: {
        id: BigInt(id),
      },
      data: {
        isRead: 1,
      },
    });

    return {
      code: 0,
      message: '已读成功',
      data: serializeValue(updated),
    };
  }

  async toggleFavorite(dto: ToggleFavoriteDto) {
    const userId = BigInt(dto.userId);
    const targetId = BigInt(dto.targetId);

    const current = await this.prisma.userFavorite.findFirst({
      where: {
        userId,
        targetType: dto.targetType,
        targetId,
      },
    });

    if (current) {
      await this.prisma.userFavorite.delete({
        where: {
          id: current.id,
        },
      });

      return {
        code: 0,
        message: '取消收藏成功',
        data: {
          favorited: false,
        },
      };
    }

    const created = await this.prisma.userFavorite.create({
      data: {
        userId,
        targetType: dto.targetType,
        targetId,
      },
    });

    return {
      code: 0,
      message: '收藏成功',
      data: {
        favorited: true,
        favorite: serializeValue(created),
      },
    };
  }

  async getFavoriteList(userId: number, targetType?: 'campaign' | 'article') {
    const list = await this.prisma.userFavorite.findMany({
      where: {
        userId: BigInt(userId),
        ...(targetType ? { targetType } : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const campaignIds = list.filter((item) => item.targetType === 'campaign').map((item) => item.targetId);
    const articleIds = list.filter((item) => item.targetType === 'article').map((item) => item.targetId);

    const [campaigns, articles] = await Promise.all([
      campaignIds.length
        ? this.prisma.campaign.findMany({
            where: {
              id: { in: campaignIds },
            },
          })
        : Promise.resolve([]),
      articleIds.length
        ? this.prisma.contentArticle.findMany({
            where: {
              id: { in: articleIds },
            },
          })
        : Promise.resolve([]),
    ]);

    const campaignMap = new Map(campaigns.map((item) => [item.id.toString(), item]));
    const articleMap = new Map(articles.map((item) => [item.id.toString(), item]));

    const data = list.map((item) => ({
      ...serializeValue(item),
      target:
        item.targetType === 'campaign'
          ? serializeValue(campaignMap.get(item.targetId.toString()) ?? null)
          : serializeValue(articleMap.get(item.targetId.toString()) ?? null),
    }));

    return {
      code: 0,
      message: 'ok',
      data,
    };
  }

  async getCertificateList(userId: number) {
    const list = await this.prisma.userCertificate.findMany({
      where: {
        userId: BigInt(userId),
        status: 1,
      },
      orderBy: {
        issuedAt: 'desc',
      },
    });

    return {
      code: 0,
      message: 'ok',
      data: serializeValue(list),
    };
  }

  async getLearningRecordList(userId: number) {
    const list = await this.prisma.learningRecord.findMany({
      where: {
        userId: BigInt(userId),
        status: 1,
      },
      orderBy: [{ lastStudyAt: 'desc' }, { createdAt: 'desc' }],
    });

    return {
      code: 0,
      message: 'ok',
      data: serializeValue(list),
    };
  }

  async createFeedback(dto: CreateFeedbackDto) {
    const created = await this.prisma.userFeedback.create({
      data: {
        userId: dto.userId ? BigInt(dto.userId) : undefined,
        type: dto.type?.trim() || 'suggestion',
        content: dto.content.trim(),
        contact: dto.contact?.trim() || undefined,
        status: 0,
      },
    });

    return {
      code: 0,
      message: '提交成功',
      data: serializeValue(created),
    };
  }

  async getAgentReviewList(userId: number) {
    const list = await this.prisma.agentReview.findMany({
      where: {
        agentUserId: BigInt(userId),
        status: 1,
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
