import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { CreateShareDto } from './dto/create-share.dto';
import { VisitShareDto } from './dto/visit-share.dto';

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

  @Post('app/share/create')
  createShare(@Body() dto: CreateShareDto) {
    return this.campaignService.createShare(dto);
  }

  @Post('app/share/visit')
  visitShare(@Body() dto: VisitShareDto) {
    return this.campaignService.visitShare(dto);
  }

  @Get('app/share/list/:userId')
  getShareList(@Param('userId') userId: string) {
    return this.campaignService.getShareList(Number(userId));
  }
}
