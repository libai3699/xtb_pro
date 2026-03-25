import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { AdminLoginDto, AppLoginDto, AppRegisterDto } from './dto/login.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/login')
  adminLogin(@Body() dto: AdminLoginDto, @Req() req: Request) {
    return this.authService.adminLogin(dto, req);
  }

  @Post('app/login/wechat')
  appLogin(@Body() dto: AppLoginDto, @Req() req: Request) {
    return this.authService.appLogin(dto, req);
  }

  @Post('app/register')
  appRegister(@Body() dto: AppRegisterDto) {
    return this.authService.appRegister(dto);
  }

  @Get('admin/login-log/list')
  getAdminLoginLogs() {
    return this.authService.getAdminLoginLogs();
  }
}
