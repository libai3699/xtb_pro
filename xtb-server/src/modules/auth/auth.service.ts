import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { PrismaService } from '../../common/prisma/prisma.service';
import { verifyPassword } from '../../common/utils/auth.util';
import { getRequestIp, getRequestUserAgent } from '../../common/utils/request.util';
import { serializeValue } from '../../common/utils/serialize.util';
import { AdminLoginDto, AppLoginDto, AppRegisterDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async adminLogin(dto: AdminLoginDto, req: Request) {
    const admin = await this.prisma.adminUser.findFirst({
      where: {
        username: dto.username,
        status: 1,
      },
    });

    if (!admin || !verifyPassword(dto.password, admin.password)) {
      await this.writeLoginLog({
        loginType: 'admin',
        username: dto.username,
        role: 'admin',
        loginStatus: 0,
        ip: getRequestIp(req),
        userAgent: getRequestUserAgent(req),
        message: '账号或密码错误',
      });
      throw new UnauthorizedException('账号或密码错误');
    }

    await this.writeLoginLog({
      loginType: 'admin',
      adminUserId: admin.id,
      username: admin.username,
      role: admin.role,
      loginStatus: 1,
      ip: getRequestIp(req),
      userAgent: getRequestUserAgent(req),
      message: '登录成功',
    });

    return {
      code: 0,
      message: '登录成功',
      data: {
        token: `admin-token-${admin.id.toString()}`,
        user: serializeValue(admin),
      },
    };
  }

  async appLogin(dto: AppLoginDto, req: Request) {
    const mockOpenid = `${dto.role}_${dto.code}`;

    let user = await this.prisma.appUser.findFirst({
      where: {
        openid: mockOpenid,
      },
    });

    if (!user) {
      user = await this.prisma.appUser.create({
        data: {
          role: dto.role,
          openid: mockOpenid,
          nickname: dto.role === 'agent' ? '新代理用户' : '新学生用户',
          status: 1,
        },
      });

      if (dto.role === 'agent') {
        await this.prisma.agentProfile.create({
          data: {
            userId: user.id,
            realName: '待完善',
            status: 0,
          },
        });
      }
    }

    await this.writeLoginLog({
      loginType: 'app',
      appUserId: user.id,
      username: user.mobile || user.nickname || user.id.toString(),
      role: user.role,
      loginStatus: 1,
      ip: getRequestIp(req),
      userAgent: getRequestUserAgent(req),
      message: '登录成功',
    });

    return {
      code: 0,
      message: '登录成功',
      data: {
        token: `app-token-${user.id.toString()}`,
        user: serializeValue(user),
      },
    };
  }

  async appRegister(dto: AppRegisterDto) {
    const exists = await this.prisma.appUser.findFirst({
      where: {
        mobile: dto.mobile,
        role: dto.role,
      },
    });

    if (exists) {
      throw new ConflictException('手机号已注册');
    }

    const user = await this.prisma.appUser.create({
      data: {
        role: dto.role,
        nickname: dto.nickname,
        mobile: dto.mobile,
        avatar: dto.avatar,
        status: 1,
      },
    });

    if (dto.role === 'agent') {
      await this.prisma.agentProfile.create({
        data: {
          userId: user.id,
          realName: dto.nickname,
          status: 0,
        },
      });
    }

    return {
      code: 0,
      message: '注册成功',
      data: serializeValue(user),
    };
  }

  async getAdminLoginLogs() {
    const list = await this.prisma.loginLog.findMany({
      orderBy: {
        loginAt: 'desc',
      },
      include: {
        adminUser: {
          select: {
            id: true,
            username: true,
            name: true,
            role: true,
          },
        },
      },
      take: 200,
    });

    return {
      code: 0,
      message: 'ok',
      data: serializeValue(list),
    };
  }

  private async writeLoginLog(data: {
    loginType: string;
    adminUserId?: bigint;
    appUserId?: bigint;
    username?: string;
    role?: string;
    loginStatus: number;
    ip?: string;
    userAgent?: string;
    message?: string;
  }) {
    await this.prisma.loginLog.create({
      data,
    });
  }
}
