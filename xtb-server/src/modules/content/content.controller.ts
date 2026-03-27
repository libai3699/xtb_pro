import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ContentService } from './content.service';
import { SaveContentArticleDto } from './dto/save-content-article.dto';

@Controller()
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('admin/content/list')
  getAdminList(@Query('type') type?: string) {
    return this.contentService.getAdminList(type);
  }

  @Post('admin/content/create')
  create(@Body() dto: SaveContentArticleDto) {
    return this.contentService.create(dto);
  }

  @Post('admin/content/update/:id')
  update(@Param('id') id: string, @Body() dto: SaveContentArticleDto) {
    return this.contentService.update(Number(id), dto);
  }

  @Post('admin/content/delete/:id')
  delete(@Param('id') id: string) {
    return this.contentService.delete(Number(id));
  }

  @Get('app/content/list')
  getAppList(@Query('type') type: 'news' | 'help') {
    return this.contentService.getAppList(type);
  }

  @Get('app/content/detail/:id')
  getDetail(@Param('id') id: string) {
    return this.contentService.getDetail(Number(id));
  }
}
