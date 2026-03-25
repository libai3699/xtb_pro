import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('admin/user/list')
  getAdminUserList() {
    return this.userService.getAdminUserList();
  }

  @Get('admin/admin-user/list')
  getAdminManagerList() {
    return this.userService.getAdminManagerList();
  }
}

