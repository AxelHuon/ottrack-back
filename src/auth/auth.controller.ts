import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ApiOkResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { UserDTO } from '../users/dto/user.dto';
import { UserService } from '../users/user.service';
import { hashText } from '../utils/crypto';
import { sendEmail } from '../utils/emailService';
import { AuthService } from './auth.service';
import {
  AuthForgotPasswordRequestDTO,
  AuthForgotPasswordResponseDTO,
  AuthLoginGoogleRequestDTO,
  AuthLoginRequestDTO,
  AuthLoginResponseDTO,
  AuthRefreshTokenRequestDTO,
  AuthRegisterRequestDTO,
  AuthResetPasswordRequestDTO,
  AuthResetPasswordResponseDTO,
} from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt.guards';
import { LocalGuard } from './guards/local.guards';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  @UseGuards(LocalGuard)
  @ApiOkResponse({ type: AuthLoginResponseDTO })
  postLogin(
    @Req() req: Request,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() authLoginRequestDTO: AuthLoginRequestDTO,
  ): AuthLoginResponseDTO {
    return req.user as AuthLoginResponseDTO;
  }

  @Post('callback/google')
  @ApiOkResponse({ type: AuthLoginResponseDTO })
  async postGoogleAuth(
    @Body() authLoginGoogleRequestDTO: AuthLoginGoogleRequestDTO,
  ): Promise<AuthLoginResponseDTO> {
    return this.authService.authenticateWithGoogle(
      authLoginGoogleRequestDTO.code,
    );
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async postLogout(@Req() req: Request) {
    if (!req.user) {
      throw new UnauthorizedException('User not found');
    }
    const userData = req.user as UserDTO;
    return this.authService.logout(userData.id);
  }

  @Post('refresh')
  @ApiOkResponse({ type: AuthLoginResponseDTO })
  async postRefresh(@Body() body: AuthRefreshTokenRequestDTO) {
    const { refreshToken } = body;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token requis');
    }
    try {
      const decoded = this.jwtService.verify(refreshToken) as UserDTO;
      if (!decoded || !decoded.id) {
        throw new UnauthorizedException('Invalid token');
      }
      return await this.authService.refreshToken(decoded.id, refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  @Post('register')
  async register(@Body() authRegisterRequestApiDTO: AuthRegisterRequestDTO) {
    const registerUser = await this.authService.register(
      authRegisterRequestApiDTO,
    );
    if (!registerUser) {
      return 'User already exists';
    } else {
      return 'User created';
    }
  }

  @Post('forgot-password')
  @ApiOkResponse({ type: AuthForgotPasswordResponseDTO })
  async forgotPassword(
    @Body() body: AuthForgotPasswordRequestDTO,
  ): Promise<AuthForgotPasswordResponseDTO> {
    const user = await this.userService.getUserByEmail(body.email);
    if (!user) {
      throw new BadRequestException('No user found with that email address.');
    }

    const resetToken = await this.authService.generatePasswordResetToken(
      user.id,
    );

    const resetLink =
      'http://localhost:3000/reset-password?token=' + resetToken;

    await sendEmail(
      body.email,
      'BrewTrack - Réinitialisez votre mot de passe',
      'forgotPasswordTemplate',
      {
        resetLink,
      },
    );

    return { message: 'email sent' };
  }

  @Post('reset-password')
  @ApiOkResponse({ type: AuthResetPasswordResponseDTO })
  async resetPassword(
    @Body() body: AuthResetPasswordRequestDTO,
  ): Promise<AuthResetPasswordResponseDTO> {
    const isValid = await this.authService.verifyPasswordResetToken(body.token);

    if (!isValid) {
      throw new BadRequestException('invalid token or token expired');
    }

    const tokenRecord = await this.prisma.passwordResetToken.findUnique({
      where: { token: body.token },
    });

    if (!tokenRecord) {
      throw new BadRequestException('invalid token');
    }

    const hashedPassword = await hashText(body.newPassword);
    await this.prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { password: hashedPassword },
    });

    await this.authService.invalidatePasswordResetToken(tokenRecord.userId);

    return { message: 'password reset successful' };
  }
}
