import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsArray, IsOptional } from 'class-validator';
import { UserDTO } from '../../users/dto/user.dto';

export class CreateRoomsBodyDto {
  @ApiProperty({
    description: 'Titre de la salle',
    example: 'Salle de discussion projet A',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: "Identifiant de l'administrateur de la salle",
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  adminId: string;

  @ApiPropertyOptional({
    description: 'Liste des identifiants des utilisateurs à ajouter à la salle',
    example: ['123e4567-e89b-12d3-a456-426614174000', '223e4567-e89b-12d3-a456-426614174000'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  users?: string[];
}

export class RoomsDTO {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  adminId: string;

  @ApiProperty({ type: String })
  slug: string;

  @ApiProperty({ type: [UserDTO] })
  users: UserDTO[];

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
