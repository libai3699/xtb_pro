import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';

@Controller()
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Get('admin/campaign/list')
  getAdminList() {
    return this.campaignService.getAdminList();
  }

  @Post('admin/campaign/create')
  create(@Body() dto: CreateCampaignDto) {
    return this.campaignService.create(dto);
  }

  @Get('app/campaign/list')
  getAppList() {
    return this.campaignService.getAppList();
  }

  @Get('app/campaign/detail/:id')
  getDetail(@Param('id') id: string) {
    return this.campaignService.getDetail(Number(id));
  }
}

