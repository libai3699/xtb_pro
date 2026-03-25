import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { serializeValue } from '../../common/utils/serialize.util';

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

