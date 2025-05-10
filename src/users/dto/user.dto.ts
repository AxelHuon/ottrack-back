import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserDTO {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: String })
  firstName: string;

  @ApiProperty({ type: String })
  lastName: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  profilePicture?: string | null;

  @ApiProperty({ type: Date })
  createdAt: Date;
}

export class GetUserByIdParamsDTO {
  @ApiProperty({
    description: "Identifiant de l'utilisateur",
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsString()
  id: string;
}
