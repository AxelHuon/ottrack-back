import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
  @ApiProperty({ type: String })
  id: string;
}
