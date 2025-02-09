import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guards';
import { getUserByIdParamsDto, getUserResponseDto } from './user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: [getUserResponseDto] })
  getUsers(): Promise<getUserResponseDto[]> {
    return this.userService.getUsers();
  }

  @Get(':id')
  @ApiOkResponse({ type: getUserResponseDto })
  getUsersById(
    @Param() params: getUserByIdParamsDto,
  ): Promise<getUserResponseDto | null> {
    const { id } = params;
    return this.userService.getUserById(id);
  }
}
