import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AgentService } from './agent.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';

@Controller()
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Get('admin/agent/list')
  getAdminList() {
    return this.agentService.getAdminList();
  }

  @Post('admin/agent/create')
  create(@Body() dto: CreateAgentDto) {
    return this.agentService.create(dto);
  }

  @Post('admin/agent/update/:id')
  update(@Param('id') id: string, @Body() dto: UpdateAgentDto) {
    return this.agentService.update(Number(id), dto);
  }

  @Post('admin/agent/delete/:id')
  delete(@Param('id') id: string) {
    return this.agentService.delete(Number(id));
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
