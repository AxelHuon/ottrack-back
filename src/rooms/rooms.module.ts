import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [RoomsController],
  providers: [PrismaService, RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
