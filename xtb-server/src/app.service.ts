import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      code: 0,
      message: 'ok',
      data: {
        service: 'xtb-server',
        status: 'running',
      },
    };
  }
}

