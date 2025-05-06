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
  DrinkDTO,
  DrinkTypeDTO,
  GetDrinksByUserIdDTO,
  GetDrinksByUserIdParamsDTO,
  GetDrinksByUserIdQueryDTO,
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

  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Récupérer les boissons d'un utilisateur" })
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
    description: 'Boissons récupérées avec succès',
    type: GetDrinksByUserIdDTO,
  })
  @ApiUnauthorizedResponse({ description: 'Non autorisé' })
  @ApiNotFoundResponse({ description: 'Aucune boisson trouvée' })
  async getDrinksByUserId(
    @Param() params: GetDrinksByUserIdParamsDTO,
    @Query() query: GetDrinksByUserIdQueryDTO,
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
}
