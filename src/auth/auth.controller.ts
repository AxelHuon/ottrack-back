import {
  Body,
  Controller,
  HttpException,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ApiOkResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { UserDTO } from '../users/dto/user.dto';
import { UserService } from '../users/user.service';
import { AuthService } from './auth.service';
import {
  AuthLoginGoogleRequestDTO,
  AuthLoginRequestDTO,
  AuthLoginResponseDTO,
  AuthRefreshTokenRequestDTO,
  AuthRegisterRequestDTO,
} from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt.guards';
import { LocalGuard } from './guards/local.guards';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
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

  @Post('google/callback')
  @ApiOkResponse({ type: AuthLoginResponseDTO })
  async postGoogleAuthCallback(
    @Body() authLoginGoogleRequestDTO: AuthLoginGoogleRequestDTO,
  ): Promise<AuthLoginResponseDTO> {
    try {
      const { accessToken, refreshToken } =
        await this.authService.handleGoogleLogin(authLoginGoogleRequestDTO);
      return { accessToken, refreshToken };
    } catch {
      throw new HttpException('Internal Serveur Error', 500);
    }
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
    const decoded = this.jwtService.decode(refreshToken) as UserDTO;
    if (!decoded || !decoded.id) {
      throw new UnauthorizedException('Invalid token');
    }
    return await this.authService.refreshToken(decoded.id, refreshToken);
  }

  @Post('register')
  async register(@Body() authRegisterRequestApiDTO: AuthRegisterRequestDTO) {
    const registerUser = await this.userService.createUser(
      authRegisterRequestApiDTO,
    );
    if (!registerUser) {
      return 'User already exists';
    } else {
      return 'User created';
    }
  }
}
