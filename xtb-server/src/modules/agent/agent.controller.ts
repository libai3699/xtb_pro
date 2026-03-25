import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AgentService } from './agent.service';

@Controller()
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Get('admin/agent/list')
  getAdminList() {
    return this.agentService.getAdminList();
  }

  @Post('admin/agent/audit/:id')
  audit(@Param('id') id: string) {
    return this.agentService.audit(Number(id));
  }

  @Get('app/my/stats')
  getMyStats(@Query('userId') userId?: string) {
    return this.agentService.getMyStats(userId ? Number(userId) : undefined);
  }
}
