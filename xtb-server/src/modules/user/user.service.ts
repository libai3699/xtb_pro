import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { serializeValue } from '../../common/utils/serialize.util';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getAdminUserList() {
    const list = await this.prisma.appUser.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        agentProfile: true,
      },
    });

    return {
      code: 0,
      message: 'ok',
      data: serializeValue(list),
    };
  }

  async createAppUser(dto: CreateUserDto) {
    if (dto.role === 'agent' && !dto.realName?.trim()) {
      throw new BadRequestException('代理用户必须填写真实姓名');
    }

    const created = await this.prisma.$transaction(async (tx) => {
      const user = await tx.appUser.create({
        data: {
          role: dto.role,
          nickname: dto.nickname,
          mobile: dto.mobile,
          avatar: dto.avatar,
          status: dto.status ?? 1,
        },
      });

      if (dto.role === 'agent') {
        await tx.agentProfile.create({
          data: {
            userId: user.id,
            realName: dto.realName!,
            schoolName: dto.schoolName,
            majorName: dto.majorName,
            gradeName: dto.gradeName,
            inviteCode: dto.inviteCode,
            status: dto.status ?? 0,
          },
        });
      }

      return tx.appUser.findUnique({
        where: { id: user.id },
        include: { agentProfile: true },
      });
    });

    return {
      code: 0,
      message: '创建成功',
      data: serializeValue(created),
    };
  }

  async updateAppUser(id: number, dto: UpdateUserDto) {
    const current = await this.prisma.appUser.findUnique({
      where: { id: BigInt(id) },
      include: { agentProfile: true },
    });

    if (!current) {
      throw new NotFoundException('用户不存在');
    }

    const nextRole = dto.role ?? current.role;
    if (nextRole === 'agent' && !current.agentProfile && !dto.realName?.trim()) {
      throw new BadRequestException('代理用户必须填写真实姓名');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.appUser.update({
        where: { id: current.id },
        data: {
          role: nextRole,
          nickname: dto.nickname,
          mobile: dto.mobile,
          avatar: dto.avatar,
          status: dto.status,
        },
      });

      if (nextRole === 'agent') {
        if (current.agentProfile) {
          await tx.agentProfile.update({
            where: { userId: current.id },
            data: {
              realName: dto.realName,
              schoolName: dto.schoolName,
              majorName: dto.majorName,
              gradeName: dto.gradeName,
              inviteCode: dto.inviteCode,
              status: dto.status,
            },
          });
        } else {
          await tx.agentProfile.create({
            data: {
              userId: current.id,
              realName: dto.realName!,
              schoolName: dto.schoolName,
              majorName: dto.majorName,
              gradeName: dto.gradeName,
              inviteCode: dto.inviteCode,
              status: dto.status ?? 0,
            },
          });
        }
      } else if (current.agentProfile) {
        await tx.agentProfile.delete({
          where: { userId: current.id },
        });
      }

      return tx.appUser.findUnique({
        where: { id: current.id },
        include: { agentProfile: true },
      });
    });

    return {
      code: 0,
      message: '更新成功',
      data: serializeValue(updated),
    };
  }

  async deleteAppUser(id: number) {
    const current = await this.prisma.appUser.findUnique({
      where: { id: BigInt(id) },
      include: { agentProfile: true },
    });

    if (!current) {
      throw new NotFoundException('用户不存在');
    }

    try {
      await this.prisma.$transaction(async (tx) => {
        if (current.agentProfile) {
          await tx.agentProfile.delete({
            where: { userId: current.id },
          });
        }

        await tx.appUser.delete({
          where: { id: current.id },
        });
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new BadRequestException('该用户存在关联业务数据，不能删除');
      }
      throw error;
    }

    return {
      code: 0,
      message: '删除成功',
    };
  }

  async getAdminManagerList() {
    const list = await this.prisma.adminUser.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      code: 0,
      message: 'ok',
      data: serializeValue(list.map(({ password, ...rest }) => rest)),
    };
  }
}
