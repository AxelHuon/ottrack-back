import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddDrinkDTO, DrinkDTO } from './dto/drinks.dto';

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
      const startDate = drink_date_gte ? new Date(drink_date_gte) : undefined;
      const endDate = drink_date_lte
        ? new Date(drink_date_lte)
        : drink_date_gte
          ? new Date(new Date(drink_date_gte).setHours(23, 59, 59, 999))
          : undefined;

      return this.prisma.drink.findMany({
        include: {
          drinkType: true,
        },
        where: {
          userId,
          ...(startDate || endDate
            ? {
                drinkDate: {
                  ...(startDate ? { gte: startDate } : {}),
                  ...(endDate ? { lte: endDate } : {}),
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

  async addDrink(drink: AddDrinkDTO): Promise<DrinkDTO | null> {
    try {
      const drinkType = await this.prisma.drinkType.findUnique({
        where: {
          slug: drink.drinkTypeSlug,
        },
      });
      if (!drinkType) {
        return null;
      }
      return this.prisma.drink.create({
        data: {
          drinkDate: drink.drinkDate || new Date(),
          litersConsumed: drink.litersConsumed,
          customType: drink.drinkTypeSlug === 'autre' ? drink.customType : null,
          userId: drink.userId,
          drinkTypeId: drinkType.id,
        },
        include: {
          drinkType: true,
        },
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
