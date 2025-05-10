import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class DrinkTypeDTO {
  @ApiProperty({
    description: 'Identifiant unique du type de boisson',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nom du type de boisson',
    example: 'Eau',
  })
  name: string;

  @ApiProperty({
    description: 'Slug du type de boisson (identifiant convivial)',
    example: 'eau',
  })
  slug: string;
}

export class DrinkDTO {
  @ApiProperty({
    type: DrinkTypeDTO,
    description: 'Type de boisson',
  })
  drinkType: DrinkTypeDTO;

  @ApiProperty({
    description: 'Identifiant du type de boisson',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  drinkTypeId: string;

  @ApiProperty({
    description: 'Quantité consommée en litres',
    example: 0.5,
    minimum: 0,
  })
  litersConsumed: number;

  @ApiProperty({
    description: 'Date de consommation',
    example: '2024-05-15T14:30:00Z',
  })
  drinkDate: Date;

  @ApiPropertyOptional({
    description: 'Type de boisson personnalisé (si applicable)',
    example: 'Thé à la menthe',
    nullable: true,
  })
  @IsOptional()
  customType?: string | null;

  @ApiProperty({
    description: "Identifiant de l'utilisateur",
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;
}

export class GetDrinksByUserIdQueryDTO {
  @ApiPropertyOptional({
    description: 'Date minimum (YYYY-MM-DD)',
    example: '2024-02-01',
  })
  @IsOptional()
  @IsDateString()
  drink_date_gte?: string;

  @ApiPropertyOptional({
    description: 'Date maximum (YYYY-MM-DD)',
    example: '2024-02-15',
  })
  @IsOptional()
  @IsDateString()
  drink_date_lte?: string;

  @ApiPropertyOptional({
    description: 'Type de boisson (slug)',
    example: 'eau',
  })
  @IsOptional()
  @IsString()
  type?: string;
}

export class DrinkCountDTO {
  @ApiProperty({
    description: "Identifiant de l'utilisateur",
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    description: "Nombre de boissons de l'utilisateur",
    example: 15,
  })
  count: number;
}

export class GetDrinkCountByUserIdParamsDTO {
  @ApiProperty({
    description: "Identifiant de l'utilisateur",
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;
}

export class GetDrinkCountByUserIdQueryDTO {
  @ApiPropertyOptional({
    description: 'Date minimum (YYYY-MM-DD)',
    example: '2024-02-01',
  })
  @IsOptional()
  @IsDateString()
  drink_date_gte?: string;

  @ApiPropertyOptional({
    description: 'Date maximum (YYYY-MM-DD)',
    example: '2024-02-15',
  })
  @IsOptional()
  @IsDateString()
  drink_date_lte?: string;

  @ApiPropertyOptional({
    description: 'Type de boisson (slug)',
    example: 'eau',
  })
  @IsOptional()
  @IsString()
  type?: string;
}

export class DrinkTypeCountParamsDTO {
  @ApiProperty({
    description: "Identifiant de l'utilisateur",
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;
}

export class DrinkTypeCountQueryDTO {
  @ApiPropertyOptional({
    description: 'Date minimum (YYYY-MM-DD)',
    example: '2024-02-01',
  })
  @IsOptional()
  @IsDateString()
  drink_date_gte?: string;

  @ApiPropertyOptional({
    description: 'Date maximum (YYYY-MM-DD)',
    example: '2024-02-15',
  })
  @IsOptional()
  @IsDateString()
  drink_date_lte?: string;

  @ApiPropertyOptional({
    description: 'Type de boisson (slug)',
    example: 'eau',
  })
  @IsOptional()
  @IsString()
  type?: string;
}

export class MonthlyDrinkCountParamsDTO {
  @ApiProperty({
    description: "Identifiant de l'utilisateur",
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;
}

export class MonthlyDrinkCountQueryDTO {
  @ApiPropertyOptional({
    description: 'Date minimum (YYYY-MM-DD)',
    example: '2024-02-01',
  })
  @IsOptional()
  @IsDateString()
  drink_date_gte?: string;

  @ApiPropertyOptional({
    description: 'Date maximum (YYYY-MM-DD)',
    example: '2024-02-15',
  })
  @IsOptional()
  @IsDateString()
  drink_date_lte?: string;

  @ApiPropertyOptional({
    description: 'Type de boisson (slug)',
    example: 'eau',
  })
  @IsOptional()
  @IsString()
  type?: string;
}

export class MonthlyAverageConsumptionParamsDTO {
  @ApiProperty({
    description: "Identifiant de l'utilisateur",
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;
}

export class MonthlyAverageConsumptionQueryDTO {
  @ApiPropertyOptional({
    description: 'Date minimum (YYYY-MM-DD)',
    example: '2024-02-01',
  })
  @IsOptional()
  @IsDateString()
  drink_date_gte?: string;

  @ApiPropertyOptional({
    description: 'Date maximum (YYYY-MM-DD)',
    example: '2024-02-15',
  })
  @IsOptional()
  @IsDateString()
  drink_date_lte?: string;

  @ApiPropertyOptional({
    description: 'Type de boisson (slug)',
    example: 'eau',
  })
  @IsOptional()
  @IsString()
  type?: string;
}

export class AddDrinkDTO {
  @ApiProperty({
    description: "Identifiant de l'utilisateur",
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Slug du type de boisson',
    example: 'eau',
  })
  @IsNotEmpty()
  @IsString()
  drinkTypeSlug: string;

  @ApiProperty({
    description: 'Quantité consommée en litres',
    example: 0.5,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  litersConsumed: number;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: 'Date de consommation',
    example: '2024-05-15T14:30:00Z',
    type: String,
  })
  drinkDate: Date;

  @ApiPropertyOptional({
    description: 'Type de boisson personnalisé (si applicable)',
    example: 'Thé à la menthe',
    nullable: true,
    type: String,
  })
  @IsOptional()
  @IsString()
  customType?: string | null;
}

export class DrinkTypeCountDTO {
  @ApiProperty({
    description: "Nom du type de boisson et son nombre d'occurrences",
    example: {
      beer: 5,
      vodka: 10,
    },
    additionalProperties: { type: 'number' },
  })
  drinkTypeCounts: Record<string, number>;
}

export class MonthlyDrinkCountDTO {
  @ApiProperty({
    description: 'Nombre de boissons consommées par mois',
    example: {
      '2023-01': 5,
      '2023-02': 8,
    },
    additionalProperties: { type: 'number' },
  })
  monthlyCounts: Record<string, number>;
}

export class MonthlyAverageConsumptionDTO {
  @ApiProperty({
    description: 'Moyenne des litres consommés par mois',
    example: {
      '2023-01': 0.45,
      '2023-02': 0.32,
    },
    additionalProperties: { type: 'number' },
  })
  monthlyAverage: Record<string, number>;
}
