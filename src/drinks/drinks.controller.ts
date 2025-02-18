import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guards';
import { PrismaService } from '../prisma/prisma.service';
import { DrinksService } from './drinks.service';
import {
  DrinkDTO,
  DrinkTypeDTO,
  GetDrinksByUserIdDTO,
  GetDrinksByUserIdParamsDTO,
  GetDrinksByUserIdQueryDTO,
} from './dto/drinks.dto';

@Controller('drinks')
export class DrinksController {
  constructor(
    private readonly drinksService: DrinksService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('drinks-type')
  @ApiOkResponse({ type: [DrinkTypeDTO] })
  async getDrinksType(): Promise<DrinkTypeDTO[]> {
    try {
      return await this.prisma.drinkType.findMany();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  @Get(':userId')
  @ApiOkResponse({ type: GetDrinksByUserIdDTO })
  @UseGuards(JwtAuthGuard)
  async getDrinksByUserId(
    @Param()
    params: GetDrinksByUserIdParamsDTO,
    @Query()
    query: GetDrinksByUserIdQueryDTO,
  ): Promise<GetDrinksByUserIdDTO | null> {
    const { userId } = params;
    const { drink_date_gte, drink_date_lte, type } = query;
    const drinks: DrinkDTO[] | null =
      await this.drinksService.getDrinksByUserId(
        userId,
        drink_date_gte,
        drink_date_lte,
        type,
      );
    if (!drinks) {
      return null;
    }
    return { userId, drinks };
  }
}
