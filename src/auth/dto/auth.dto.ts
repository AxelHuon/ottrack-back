import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class AuthLoginRequestDTO {
  @ApiProperty({ type: String })
  @IsEmail({}, { message: "L'email n'est pas valide" })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

export class AuthLoginGoogleRequestDTO {
  @ApiProperty({ type: String })
  @IsNotEmpty({ message: 'Le token Google est requis' })
  code: string;
}

export class AuthLoginResponseDTO {
  @ApiProperty({ type: String })
  accessToken: string;
  @ApiProperty({ type: String })
  refreshToken: string;
}

export class AuthRefreshTokenRequestDTO {
  @ApiProperty({ type: String })
  @IsNotEmpty({ message: 'Refresh token is required' })
  refreshToken: string;
}

export class AuthRegisterRequestDTO {
  @ApiProperty({ type: String, example: 'John' })
  @IsNotEmpty({ message: 'Le prénom est requis' })
  firstName: string;

  @ApiProperty({ type: String, example: 'Doe' })
  @IsNotEmpty({ message: 'Le nom est requis' })
  lastName: string;

  @ApiProperty({ type: String, example: 'user@example.com' })
  @IsEmail({}, { message: "L'email n'est pas valide" })
  @IsNotEmpty({ message: "L'email est requis" })
  email: string;

  @ApiProperty({ type: String, minLength: 7, maxLength: 34 })
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @MinLength(7, {
    message: 'Le mot de passe doit contenir au moins 7 caractères',
  })
  @MaxLength(34, {
    message: 'Le mot de passe ne peut pas dépasser 34 caractères',
  })
  password: string;
}

export interface AuthCreateUserGoogleRequestDTO {
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
}

export class AuthForgotPasswordRequestDTO {
  @ApiProperty({ type: String, example: 'user@example.com' })
  @IsEmail({}, { message: "L'email n'est pas valide" })
  @IsNotEmpty({ message: "L'email est requis" })
  email: string;
}

export class AuthForgotPasswordResponseDTO {
  @ApiProperty({
    type: String,
    example: 'Un email de réinitialisation a été envoyé.',
  })
  message: string;
}

export class AuthResetPasswordRequestDTO {
  @ApiProperty({ type: String, example: 'your-reset-token' })
  @IsNotEmpty({ message: 'Le token de réinitialisation est requis' })
  token: string;

  @ApiProperty({
    type: String,
    minLength: 7,
    maxLength: 34,
    example: 'newpassword123',
  })
  @IsNotEmpty({ message: 'Le nouveau mot de passe est requis' })
  @MinLength(7, {
    message: 'Le mot de passe doit contenir au moins 7 caractères',
  })
  @MaxLength(34, {
    message: 'Le mot de passe ne peut pas dépasser 34 caractères',
  })
  newPassword: string;
}

export class AuthResetPasswordResponseDTO {
  @ApiProperty({
    type: String,
    example: 'Mot de passe réinitialisé avec succès',
  })
  message: string;
}
