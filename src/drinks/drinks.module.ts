import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { DrinksController } from './drinks.controller';
import { DrinksService } from './drinks.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [DrinksController],
  providers: [PrismaService, DrinksService],
  exports: [DrinksService],
})
export class DrinksModule {}
