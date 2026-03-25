import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller()
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('admin/stats/overview')
  getOverview() {
    return this.statsService.getOverview();
  }
}

