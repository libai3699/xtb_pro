import { Body, Controller, Get, Post } from '@nestjs/common';
import { LeadService } from './lead.service';
import { CreateLeadDto } from './dto/create-lead.dto';

@Controller()
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Get('admin/lead/list')
  getList() {
    return this.leadService.getList();
  }

  @Post('app/lead/submit')
  submit(@Body() dto: CreateLeadDto) {
    return this.leadService.submit(dto);
  }
}

