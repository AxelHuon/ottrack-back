import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiQuery,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guards';
import { PrismaService } from '../prisma/prisma.service';
import { DrinksService } from './drinks.service';
import {
  AddDrinkDTO,
  DrinkCountDTO,
  DrinkDTO,
  DrinkTypeCountDTO,
  DrinkTypeCountParamsDTO,
  DrinkTypeCountQueryDTO,
  DrinkTypeDTO,
  GetDrinkCountByUserIdParamsDTO,
  GetDrinkCountByUserIdQueryDTO,
  MonthlyAverageConsumptionDTO,
  MonthlyAverageConsumptionParamsDTO,
  MonthlyAverageConsumptionQueryDTO,
  MonthlyDrinkCountDTO,
  MonthlyDrinkCountParamsDTO,
  MonthlyDrinkCountQueryDTO,
} from './dto/drinks.dto';

@ApiTags('Drinks')
@Controller('drinks')
export class DrinksController {
  constructor(
    private readonly drinksService: DrinksService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('drinks-type')
  @ApiOperation({ summary: 'Récupérer tous les types de boissons' })
  @ApiOkResponse({
    description: 'Liste des types de boissons récupérée avec succès',
    type: [DrinkTypeDTO],
  })
  async getDrinksType(): Promise<DrinkTypeDTO[]> {
    try {
      return await this.prisma.drinkType.findMany();
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  @Get(':userId/drinks-type-count')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Récupérer le nombre de boissons par type pour un utilisateur',
  })
  @ApiParam({
    name: 'userId',
    description: "ID de l'utilisateur",
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'drink_date_gte',
    description: 'Date minimum (YYYY-MM-DD)',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'drink_date_lte',
    description: 'Date maximum (YYYY-MM-DD)',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'type',
    description: 'Type de boisson (slug)',
    type: String,
    required: false,
  })
  @ApiOkResponse({
    description: 'Nombre de boissons par type récupéré avec succès',
    type: DrinkTypeCountDTO,
  })
  @ApiNotFoundResponse({
    description: 'Aucune consommation trouvée pour cet utilisateur',
  })
  async getDrinkTypeCountByUserId(
    @Param() params: DrinkTypeCountParamsDTO,
    @Query() query: DrinkTypeCountQueryDTO,
  ): Promise<DrinkTypeCountDTO> {
    const { userId } = params;
    const { drink_date_gte, drink_date_lte, type } = query;
    const drinkTypeCounts = await this.drinksService.getDrinkTypeCountByUserId(
      userId,
      drink_date_gte,
      drink_date_lte,
      type,
    );
    return { drinkTypeCounts };
  }

  @Get(':userId/monthly-count')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary:
      'Récupérer le nombre de boissons consommées par mois pour un utilisateur',
  })
  @ApiParam({
    name: 'userId',
    description: "ID de l'utilisateur",
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'drink_date_gte',
    description: 'Date minimum (YYYY-MM-DD)',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'drink_date_lte',
    description: 'Date maximum (YYYY-MM-DD)',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'type',
    description: 'Type de boisson (slug)',
    type: String,
    required: false,
  })
  @ApiOkResponse({
    description: 'Nombre de boissons consommées par mois récupéré avec succès',
    type: MonthlyDrinkCountDTO,
  })
  @ApiNotFoundResponse({
    description: 'Aucune consommation trouvée pour cet utilisateur',
  })
  async getMonthlyDrinkCount(
    @Param() params: MonthlyDrinkCountParamsDTO,
    @Query() query: MonthlyDrinkCountQueryDTO,
  ): Promise<MonthlyDrinkCountDTO> {
    const { userId } = params;
    const { drink_date_gte, drink_date_lte, type } = query;
    const monthlyCounts = await this.drinksService.getMonthlyDrinkCount(
      userId,
      drink_date_gte,
      drink_date_lte,
      type,
    );
    return { monthlyCounts };
  }

  @Get(':userId/monthly-average')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary:
      'Récupérer la moyenne des litres consommés par mois pour un utilisateur',
  })
  @ApiParam({
    name: 'userId',
    description: "ID de l'utilisateur",
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'drink_date_gte',
    description: 'Date minimum (YYYY-MM-DD)',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'drink_date_lte',
    description: 'Date maximum (YYYY-MM-DD)',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'type',
    description: 'Type de boisson (slug)',
    type: String,
    required: false,
  })
  @ApiOkResponse({
    description: 'Moyenne des litres consommés par mois récupérée avec succès',
    type: MonthlyAverageConsumptionDTO,
  })
  @ApiNotFoundResponse({
    description: 'Aucune consommation trouvée pour cet utilisateur',
  })
  async getMonthlyAverageConsumption(
    @Param() params: MonthlyAverageConsumptionParamsDTO,
    @Query() query: MonthlyAverageConsumptionQueryDTO,
  ): Promise<MonthlyAverageConsumptionDTO> {
    const { userId } = params;
    const { drink_date_gte, drink_date_lte, type } = query;
    const monthlyAverage =
      await this.drinksService.getMonthlyAverageConsumption(
        userId,
        drink_date_gte,
        drink_date_lte,
        type,
      );
    return { monthlyAverage };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Ajouter une nouvelle boisson' })
  @ApiBody({
    description: 'Données de la boisson à ajouter',
    type: AddDrinkDTO,
  })
  @ApiOkResponse({
    description: 'La boisson a été ajoutée avec succès',
    type: DrinkDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Non autorisé' })
  @ApiBadRequestResponse({ description: 'Requête invalide' })
  @ApiNotFoundResponse({ description: 'Type de boisson non trouvé' })
  async addDrink(@Body() drink: AddDrinkDTO): Promise<DrinkDTO> {
    const result = await this.drinksService.addDrink(drink);
    if (!result) {
      throw new HttpException(
        'Type de boisson non trouvé ou erreur lors de la création',
        HttpStatus.BAD_REQUEST,
      );
    }
    return result;
  }
  @Get(':userId/count')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Récupérer le nombre de boissons d'un utilisateur" })
  @ApiParam({
    name: 'userId',
    description: "ID de l'utilisateur",
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'drink_date_gte',
    description: 'Date minimum (YYYY-MM-DD)',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'drink_date_lte',
    description: 'Date maximum (YYYY-MM-DD)',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'type',
    description: 'Type de boisson (slug)',
    type: String,
    required: false,
  })
  @ApiOkResponse({
    description: 'Nombre de boissons récupéré avec succès',
    type: DrinkCountDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Non autorisé' })
  @ApiNotFoundResponse({ description: 'Aucune boisson trouvée' })
  async getDrinkCountByUserId(
    @Param() params: GetDrinkCountByUserIdParamsDTO,
    @Query() query: GetDrinkCountByUserIdQueryDTO,
  ): Promise<DrinkCountDTO> {
    const { userId } = params;
    const { drink_date_gte, drink_date_lte, type } = query;
    const count = await this.drinksService.getDrinksByUserId(
      userId,
      drink_date_gte,
      drink_date_lte,
      type,
    );
    return { userId, count };
  }
}
