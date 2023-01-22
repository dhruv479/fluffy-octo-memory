import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaginationDTO } from '../../common/dto/base.dto';
import { AdminGuard } from '../../common/guards/admin.guard';
import { CreateUserDTO, LoginUserDTO, UpdateUserStatusDTO } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDTO) {
    return this.userService.createUser(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDTO) {
    return this.userService.loginUser(loginUserDto);
  }

  @Patch(':userId/status')
  @UseGuards(AdminGuard)
  updateUserStatus(
    @Body() updateUserStatusDto: UpdateUserStatusDTO,
    @Query('userId') userId: string,
  ) {
    return this.userService.updateUserStatus(userId, updateUserStatusDto);
  }

  @Get('list')
  @UseGuards(AdminGuard)
  getAllUsersList(@Param() pagination: PaginationDTO) {
    return this.userService.getUserList(pagination);
  }

  @Get('details')
  getAllUsersDetails(@Param() pagination: PaginationDTO) {
    return this.userService.getAllUserListDetailed(pagination);
  }
}
