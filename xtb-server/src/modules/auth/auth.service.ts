import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { serializeValue } from '../../common/utils/serialize.util';
import { AdminLoginDto, AppLoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async adminLogin(dto: AdminLoginDto) {
    const admin = await this.prisma.adminUser.findFirst({
      where: {
        username: dto.username,
        status: 1,
      },
    });

    if (!admin || admin.password !== dto.password) {
      throw new UnauthorizedException('账号或密码错误');
    }

    return {
      code: 0,
      message: '登录成功',
      data: {
        token: `admin-token-${admin.id.toString()}`,
        user: serializeValue(admin),
      },
    };
  }

  async appLogin(dto: AppLoginDto) {
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

    return {
      code: 0,
      message: '登录成功',
      data: {
        token: `app-token-${user.id.toString()}`,
        user: serializeValue(user),
      },
    };
  }
}
