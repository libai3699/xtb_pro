import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { GrowthService } from './growth.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { RedeemRewardDto } from './dto/redeem-reward.dto';
import { SaveRewardGoodsDto } from './dto/save-reward-goods.dto';
import { ToggleFavoriteDto } from './dto/toggle-favorite.dto';
import { UpdateRedeemOrderStatusDto } from './dto/update-redeem-order-status.dto';

@Controller()
export class GrowthController {
  constructor(private readonly growthService: GrowthService) {}

  @Get('admin/reward-goods/list')
  getAdminRewardGoodsList() {
    return this.growthService.getAdminRewardGoodsList();
  }

  @Post('admin/reward-goods/create')
  createRewardGoods(@Body() dto: SaveRewardGoodsDto) {
    return this.growthService.createRewardGoods(dto);
  }

  @Get('admin/reward-redeem-order/list')
  getAdminRedeemOrderList() {
    return this.growthService.getAdminRedeemOrderList();
  }

  @Post('admin/reward-redeem-order/update-status/:id')
  updateRedeemOrderStatus(@Param('id') id: string, @Body() dto: UpdateRedeemOrderStatusDto) {
    return this.growthService.updateRedeemOrderStatus(Number(id), dto.status);
  }

  @Get('admin/message/list')
  getAdminMessageList(@Query('userId') userId?: string) {
    return this.growthService.getAdminMessageList(userId ? Number(userId) : undefined);
  }

  @Post('admin/message/create')
  createMessage(@Body() dto: CreateMessageDto) {
    return this.growthService.createMessage(dto);
  }

  @Get('admin/certificate/list')
  getAdminCertificateList(@Query('userId') userId?: string) {
    return this.growthService.getAdminCertificateList(userId ? Number(userId) : undefined);
  }

  @Post('admin/certificate/create')
  createCertificate(@Body() dto: CreateCertificateDto) {
    return this.growthService.createCertificate(dto);
  }

  @Get('admin/learning-record/list')
  getAdminLearningRecordList(@Query('userId') userId?: string) {
    return this.growthService.getAdminLearningRecordList(userId ? Number(userId) : undefined);
  }

  @Get('admin/feedback/list')
  getAdminFeedbackList() {
    return this.growthService.getAdminFeedbackList();
  }

  @Get('admin/agent-review/list')
  getAdminAgentReviewList() {
    return this.growthService.getAdminAgentReviewList();
  }

  @Get('app/reward/overview')
  getRewardOverview(@Query('userId') userId: string) {
    return this.growthService.getRewardOverview(Number(userId));
  }

  @Get('app/reward/goods')
  getRewardGoodsList() {
    return this.growthService.getRewardGoodsList();
  }

  @Get('app/reward/records')
  getPointRecordList(@Query('userId') userId: string) {
    return this.growthService.getPointRecordList(Number(userId));
  }

  @Get('app/reward/redeem-orders')
  getRedeemOrderList(@Query('userId') userId: string) {
    return this.growthService.getRedeemOrderList(Number(userId));
  }

  @Post('app/reward/redeem')
  redeemReward(@Body() dto: RedeemRewardDto) {
    return this.growthService.redeemReward(dto);
  }

  @Get('app/message/list')
  getMessageList(@Query('userId') userId: string) {
    return this.growthService.getMessageList(Number(userId));
  }

  @Post('app/message/read/:id')
  readMessage(@Param('id') id: string) {
    return this.growthService.readMessage(Number(id));
  }

  @Post('app/favorite/toggle')
  toggleFavorite(@Body() dto: ToggleFavoriteDto) {
    return this.growthService.toggleFavorite(dto);
  }

  @Get('app/favorite/list')
  getFavoriteList(@Query('userId') userId: string, @Query('targetType') targetType?: 'campaign' | 'article') {
    return this.growthService.getFavoriteList(Number(userId), targetType);
  }

  @Get('app/certificate/list')
  getCertificateList(@Query('userId') userId: string) {
    return this.growthService.getCertificateList(Number(userId));
  }

  @Get('app/learning-record/list')
  getLearningRecordList(@Query('userId') userId: string) {
    return this.growthService.getLearningRecordList(Number(userId));
  }

  @Post('app/feedback/create')
  createFeedback(@Body() dto: CreateFeedbackDto) {
    return this.growthService.createFeedback(dto);
  }

  @Get('app/agent-review/list')
  getAgentReviewList(@Query('userId') userId: string) {
    return this.growthService.getAgentReviewList(Number(userId));
  }
}
