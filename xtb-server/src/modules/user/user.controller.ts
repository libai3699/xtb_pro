import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('admin/user/list')
  getAdminUserList() {
    return this.userService.getAdminUserList();
  }

  @Post('admin/user/create')
  createAppUser(@Body() dto: CreateUserDto) {
    return this.userService.createAppUser(dto);
  }

  @Post('admin/user/update/:id')
  updateAppUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateAppUser(Number(id), dto);
  }

  @Post('admin/user/delete/:id')
  deleteAppUser(@Param('id') id: string) {
    return this.userService.deleteAppUser(Number(id));
  }

  @Get('admin/admin-user/list')
  getAdminManagerList() {
    return this.userService.getAdminManagerList();
  }
}
