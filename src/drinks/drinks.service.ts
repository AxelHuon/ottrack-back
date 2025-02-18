import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DrinkDTO } from './dto/drinks.dto';

@Injectable()
export class DrinksService {
  constructor(private prisma: PrismaService) {}

  async getDrinksByUserId(
    userId: string,
    drink_date_gte?: string,
    drink_date_lte?: string,
    type?: string,
  ): Promise<DrinkDTO[] | null> {
    try {
      return this.prisma.drink.findMany({
        include: {
          drinkType: true,
        },
        where: {
          userId,
          ...(drink_date_gte || drink_date_lte
            ? {
                drinkDate: {
                  ...(drink_date_gte ? { gte: new Date(drink_date_gte) } : {}),
                  ...(drink_date_lte ? { lte: new Date(drink_date_lte) } : {}),
                },
              }
            : {}),
          ...(type ? { drinkType: { slug: type } } : {}),
        },
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
