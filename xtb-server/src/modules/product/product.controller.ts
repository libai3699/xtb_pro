import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('admin/product/list')
  getAdminList() {
    return this.productService.getAdminList();
  }

  @Post('admin/product/create')
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Get('app/product/list')
  getAppList(@Query('campaignId') campaignId?: string) {
    return this.productService.getAppList(campaignId ? Number(campaignId) : undefined);
  }
}

