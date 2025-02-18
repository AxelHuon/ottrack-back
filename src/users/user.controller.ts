import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guards';
import { GetUserByIdParamsDTO, UserDTO } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserDTO })
  getUsersById(@Param() params: GetUserByIdParamsDTO): Promise<UserDTO | null> {
    const { id } = params;
    return this.userService.getUserById(id);
  }
}
