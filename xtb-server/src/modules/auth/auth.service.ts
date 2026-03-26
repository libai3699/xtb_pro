import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { PrismaService } from '../../common/prisma/prisma.service';
import { hashPassword, verifyPassword } from '../../common/utils/auth.util';
import { resolveIpGeo } from '../../common/utils/ip-geo.util';
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
    if (!dto.account?.trim() || !dto.password?.trim()) {
      throw new BadRequestException(`${dto.role === 'agent' ? '代理' : '学生'}登录请输入账号和密码`);
    }

    const account = dto.account.trim();
    const user = await this.prisma.appUser.findFirst({
      where: {
        role: dto.role,
        account,
        status: 1,
      },
    });

    if (!user || !user.password || !verifyPassword(dto.password, user.password)) {
      await this.writeLoginLog({
        loginType: 'app',
        username: account,
        role: dto.role,
        loginStatus: 0,
        ip: getRequestIp(req),
        userAgent: getRequestUserAgent(req),
        message: '账号或密码错误',
      });
      throw new UnauthorizedException('账号或密码错误');
    }

    await this.writeLoginLog({
      loginType: 'app',
      appUserId: user.id,
      username: user.account || user.nickname || user.id.toString(),
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
    const roleLabel = dto.role === 'agent' ? '代理' : '学生';
    const account = dto.account?.trim();
    const password = dto.password?.trim();
    const nickname = dto.nickname.trim();
    const mobile = dto.mobile?.trim() || undefined;

    if (!account || !password) {
      throw new BadRequestException(`${roleLabel}注册请输入账号和密码`);
    }

    const accountExists = await this.prisma.appUser.findFirst({
      where: {
        account,
      },
    });

    if (accountExists) {
      throw new ConflictException('账号已存在');
    }

    if (dto.role === 'agent') {
      if (!mobile) {
        throw new BadRequestException('代理注册请填写手机号');
      }
      if (!dto.realName?.trim()) {
        throw new BadRequestException('代理注册请填写真实姓名');
      }
    }

    const user = await this.prisma.appUser.create({
      data: {
        role: dto.role,
        account,
        password: hashPassword(password),
        nickname,
        mobile,
        avatar: dto.avatar,
        status: 1,
      },
    });

    if (dto.role === 'agent') {
      await this.prisma.agentProfile.create({
        data: {
          userId: user.id,
          realName: dto.realName!.trim(),
          schoolName: dto.schoolName?.trim() || undefined,
          majorName: dto.majorName?.trim() || undefined,
          gradeName: dto.gradeName?.trim() || undefined,
          inviteCode: dto.inviteCode?.trim() || undefined,
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
    countryName?: string;
    regionName?: string;
    cityName?: string;
    orgName?: string;
    locationText?: string;
    userAgent?: string;
    message?: string;
  }) {
    const ipGeo = await resolveIpGeo(data.ip);

    await this.prisma.loginLog.create({
      data: {
        ...data,
        ...ipGeo,
      },
    });
  }
}
