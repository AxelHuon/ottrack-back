import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class DrinkTypeDTO {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  slug: string;
}

export class DrinkDTO {
  @ApiProperty({ type: DrinkTypeDTO })
  drinkType: DrinkTypeDTO;

  @ApiProperty({ type: String })
  drinkTypeId: string;

  @ApiProperty({ type: Number })
  litersConsumed: number;

  @ApiProperty({ type: Date })
  drinkDate: Date;

  @ApiProperty({ type: String })
  @IsOptional()
  customType?: string | null;

  @ApiProperty({ type: String })
  userId: string;
}

export class GetDrinksByUserIdDTO {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  userId: string;
  @ApiProperty({ type: DrinkDTO, isArray: true })
  drinks: DrinkDTO[];
}

export class GetDrinksByUserIdParamsDTO {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  userId: string;
}

export class GetDrinksByUserIdQueryDTO {
  @ApiPropertyOptional({
    type: String,
    example: '2024-02-01',
    description: 'Date minimum (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  drink_date_gte?: string;

  @ApiPropertyOptional({
    type: String,
    example: '2024-02-15',
    description: 'Date maximum (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  drink_date_lte?: string;

  @ApiPropertyOptional({
    type: String,
    example: 'biere',
  })
  @IsOptional()
  type?: string;
}
