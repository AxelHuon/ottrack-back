import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guards';
import { CreateRoomsBodyDto, GetRoomsBySludDTO, RoomsDTO } from './dto/rooms.dto';
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

  @Get(':slug')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({type:RoomsDTO})
  async getRoomBySlug(@Param() params: GetRoomsBySludDTO): Promise<RoomsDTO | null>{
  const {slug} = params
    return await this.roomsService.getRoomBySlug(slug)
  }
}
