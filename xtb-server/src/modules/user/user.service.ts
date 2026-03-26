import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { hashPassword } from '../../common/utils/auth.util';
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
      data: serializeValue(list.map(({ password, ...rest }) => rest)),
    };
  }

  async createAppUser(dto: CreateUserDto) {
    const role = dto.role;
    const nickname = dto.nickname.trim();
    const mobile = dto.mobile?.trim() || undefined;
    const account = dto.account?.trim() || undefined;
    const password = dto.password?.trim() || undefined;

    if (role === 'agent') {
      if (!mobile) {
        throw new BadRequestException('代理用户必须填写手机号');
      }
      if (!dto.realName?.trim()) {
        throw new BadRequestException('代理用户必须填写真实姓名');
      }
    }

    if (role === 'student') {
      if (!account) {
        throw new BadRequestException('学生用户必须设置登录账号');
      }
      if (!password) {
        throw new BadRequestException('学生用户必须设置登录密码');
      }

      const exists = await this.prisma.appUser.findFirst({
        where: {
          account,
        },
      });

      if (exists) {
        throw new BadRequestException('登录账号已存在');
      }
    }

    const created = await this.prisma.$transaction(async (tx) => {
      const user = await tx.appUser.create({
        data: {
          role,
          account: role === 'student' ? account : null,
          password: role === 'student' ? hashPassword(password!) : null,
          nickname,
          mobile,
          avatar: dto.avatar?.trim() || undefined,
          status: dto.status ?? 1,
        },
      });

      if (role === 'agent') {
        await tx.agentProfile.create({
          data: {
            userId: user.id,
            realName: dto.realName!.trim(),
            schoolName: dto.schoolName?.trim() || undefined,
            majorName: dto.majorName?.trim() || undefined,
            gradeName: dto.gradeName?.trim() || undefined,
            inviteCode: dto.inviteCode?.trim() || undefined,
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
    const nextNickname = dto.nickname?.trim();
    const nextMobile = dto.mobile !== undefined ? dto.mobile.trim() || null : undefined;
    const nextAccount = dto.account !== undefined ? dto.account.trim() || null : undefined;
    const nextPassword = dto.password?.trim();
    const nextRealName = dto.realName?.trim();

    if (nextRole === 'agent') {
      const effectiveMobile = nextMobile === undefined ? current.mobile : nextMobile;
      const effectiveRealName = nextRealName || current.agentProfile?.realName;

      if (!effectiveMobile) {
        throw new BadRequestException('代理用户必须填写手机号');
      }
      if (!effectiveRealName) {
        throw new BadRequestException('代理用户必须填写真实姓名');
      }
    }

    if (nextRole === 'student') {
      const effectiveAccount = nextAccount === undefined ? current.account : nextAccount;
      if (!effectiveAccount) {
        throw new BadRequestException('学生用户必须设置登录账号');
      }

      const duplicate = await this.prisma.appUser.findFirst({
        where: {
          account: effectiveAccount,
          id: {
            not: current.id,
          },
        },
      });

      if (duplicate) {
        throw new BadRequestException('登录账号已存在');
      }
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.appUser.update({
        where: { id: current.id },
        data: {
          role: nextRole,
          nickname: nextNickname,
          mobile: nextMobile,
          avatar: dto.avatar !== undefined ? dto.avatar.trim() || null : undefined,
          status: dto.status,
          account: nextRole === 'student' ? nextAccount : null,
          password:
            nextRole === 'student'
              ? nextPassword
                ? hashPassword(nextPassword)
                : undefined
              : null,
        },
      });

      if (nextRole === 'agent') {
        if (current.agentProfile) {
          await tx.agentProfile.update({
            where: { userId: current.id },
            data: {
              realName: nextRealName,
              schoolName: dto.schoolName !== undefined ? dto.schoolName.trim() || null : undefined,
              majorName: dto.majorName !== undefined ? dto.majorName.trim() || null : undefined,
              gradeName: dto.gradeName !== undefined ? dto.gradeName.trim() || null : undefined,
              inviteCode: dto.inviteCode !== undefined ? dto.inviteCode.trim() || null : undefined,
              status: dto.status,
            },
          });
        } else {
          await tx.agentProfile.create({
            data: {
              userId: current.id,
              realName: nextRealName!,
              schoolName: dto.schoolName?.trim() || undefined,
              majorName: dto.majorName?.trim() || undefined,
              gradeName: dto.gradeName?.trim() || undefined,
              inviteCode: dto.inviteCode?.trim() || undefined,
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
