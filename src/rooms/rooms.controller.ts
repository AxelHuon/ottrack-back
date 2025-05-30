import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guards';
import { CreateRoomsBodyDto, RoomsDTO } from './dto/rooms.dto';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: RoomsDTO })
  async createRoom(@Body() createRoomDto: CreateRoomsBodyDto) {
    return await this.roomsService.createRoom(createRoomDto);
  }
}
