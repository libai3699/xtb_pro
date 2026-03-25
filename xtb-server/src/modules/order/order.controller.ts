import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('admin/order/list')
  getAdminList() {
    return this.orderService.getAdminList();
  }

  @Post('app/order/create')
  create(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  @Get('app/my/orders')
  getMyOrders(@Query('userId') userId?: string) {
    return this.orderService.getMyOrders(userId ? Number(userId) : undefined);
  }
}
