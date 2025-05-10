import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddDrinkDTO, DrinkDTO } from './dto/drinks.dto';

@Injectable()
export class DrinksService {
  constructor(private prisma: PrismaService) {}

  async getDrinkTypeCountByUserId(
    userId: string,
    drink_date_gte?: string,
    drink_date_lte?: string,
    type?: string,
  ): Promise<Record<string, number>> {
    try {
      const startDate = drink_date_gte ? new Date(drink_date_gte) : undefined;
      const endDate = drink_date_lte
        ? new Date(drink_date_lte)
        : drink_date_gte
          ? new Date(new Date(drink_date_gte).setHours(23, 59, 59, 999))
          : undefined;

      const whereClause: any = { userId };

      if (startDate || endDate) {
        whereClause.drinkDate = {
          ...(startDate ? { gte: startDate } : {}),
          ...(endDate ? { lte: endDate } : {}),
        };
      }

      if (type) {
        whereClause.drinkType = { slug: type };
      }

      const drinkCounts = await this.prisma.drink.groupBy({
        by: ['drinkTypeId'],
        where: whereClause,
        _count: { drinkTypeId: true },
      });

      if (!drinkCounts.length) {
        return {};
      }

      const drinkTypeNames = await this.prisma.drinkType.findMany({
        where: {
          id: { in: drinkCounts.map((d) => d.drinkTypeId) },
        },
        select: {
          id: true,
          name: true,
        },
      });

      const typeCountMap: Record<string, number> = {};
      drinkCounts.forEach((drink) => {
        const typeInfo = drinkTypeNames.find(
          (type) => type.id === drink.drinkTypeId,
        );
        if (typeInfo) {
          typeCountMap[typeInfo.name] = drink._count.drinkTypeId;
        }
      });
      return typeCountMap;
    } catch (error) {
      console.error('Error retrieving drink types', error);
      throw new Error('An error occurred while retrieving the data.');
    }
  }

  async getMonthlyDrinkCount(
    userId: string,
    drink_date_gte?: string,
    drink_date_lte?: string,
    type?: string,
  ): Promise<Record<string, number>> {
    try {
      const startDate = drink_date_gte ? new Date(drink_date_gte) : undefined;
      const endDate = drink_date_lte
        ? new Date(drink_date_lte)
        : drink_date_gte
          ? new Date(new Date(drink_date_gte).setHours(23, 59, 59, 999))
          : undefined;

      const whereClause: any = { userId };

      if (startDate || endDate) {
        whereClause.drinkDate = {
          ...(startDate ? { gte: startDate } : {}),
          ...(endDate ? { lte: endDate } : {}),
        };
      }

      if (type) {
        whereClause.drinkType = { slug: type };
      }

      const monthlyCounts = await this.prisma.drink.groupBy({
        by: ['drinkDate'],
        where: whereClause,
        _count: { drinkDate: true },
      });

      if (!monthlyCounts.length) {
        return {};
      }

      const result: Record<string, number> = {};
      monthlyCounts.forEach((entry) => {
        const month = `${entry.drinkDate.getFullYear()}-${String(
          entry.drinkDate.getMonth() + 1,
        ).padStart(2, '0')}`;
        result[month] = (result[month] || 0) + entry._count.drinkDate;
      });

      return result;
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des consommations mensuelles',
        error,
      );
      throw new Error('Erreur lors de la récupération des données.');
    }
  }

  async getMonthlyAverageConsumption(
    userId: string,
    drink_date_gte?: string,
    drink_date_lte?: string,
    type?: string,
  ): Promise<Record<string, number>> {
    try {
      const startDate = drink_date_gte ? new Date(drink_date_gte) : undefined;
      const endDate = drink_date_lte
        ? new Date(drink_date_lte)
        : drink_date_gte
          ? new Date(new Date(drink_date_gte).setHours(23, 59, 59, 999))
          : undefined;

      const whereClause: any = { userId };

      if (startDate || endDate) {
        whereClause.drinkDate = {
          ...(startDate ? { gte: startDate } : {}),
          ...(endDate ? { lte: endDate } : {}),
        };
      }

      if (type) {
        whereClause.drinkType = { slug: type };
      }

      const drinks = await this.prisma.drink.findMany({
        where: whereClause,
        select: {
          drinkDate: true,
          litersConsumed: true,
        },
      });

      if (!drinks.length) {
        return {};
      }

      const monthlyTotals: Record<
        string,
        { count: number; totalLiters: number }
      > = {};

      drinks.forEach((drink) => {
        const month = `${drink.drinkDate.getFullYear()}-${String(
          drink.drinkDate.getMonth() + 1,
        ).padStart(2, '0')}`;

        if (!monthlyTotals[month]) {
          monthlyTotals[month] = { count: 0, totalLiters: 0 };
        }

        monthlyTotals[month].count += 1;
        monthlyTotals[month].totalLiters += drink.litersConsumed;
      });

      const result: Record<string, number> = {};
      for (const month in monthlyTotals) {
        const { count, totalLiters } = monthlyTotals[month];
        result[month] = parseFloat((totalLiters / count).toFixed(2));
      }

      return result;
    } catch (error) {
      console.error(
        'Erreur lors du calcul de la consommation moyenne mensuelle',
        error,
      );
      throw new Error('Erreur lors de la récupération des données.');
    }
  }

  async getDrinksByUserId(
    userId: string,
    drink_date_gte?: string,
    drink_date_lte?: string,
    type?: string,
  ): Promise<number> {
    try {
      const startDate = drink_date_gte ? new Date(drink_date_gte) : undefined;
      const endDate = drink_date_lte
        ? new Date(drink_date_lte)
        : drink_date_gte
          ? new Date(new Date(drink_date_gte).setHours(23, 59, 59, 999))
          : undefined;

      const count = await this.prisma.drink.count({
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

      return count;
    } catch (error) {
      console.error(error);
      return 0;
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
