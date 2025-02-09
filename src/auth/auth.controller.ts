import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { getUserResponseDto } from '../users/user.dto';
import { UserService } from '../users/user.service';
import { AuthService } from './auth.service';
import {
  AuthLoginGoogleRequestDto,
  AuthLoginRequestDto,
  AuthLoginResponseDto,
  AuthRegisterRequestDto,
} from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt.guards';
import { LocalGuard } from './guards/local.guards';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  @UseGuards(LocalGuard)
  @ApiOkResponse({ type: AuthLoginResponseDto })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async login(
    @Req() req: Request,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() authLoginRequestDto: AuthLoginRequestDto,
  ): Promise<AuthLoginResponseDto> {
    if (req.user) {
      return {
        access_token: req.user as string,
      };
    } else {
      throw new HttpException('Internal Serveur Error', 500);
    }
  }

  @Post('google/callback')
  @ApiOkResponse({ type: AuthLoginResponseDto })
  async googleAuthCallback(
    @Body() authLoginGoogleRequestDto: AuthLoginGoogleRequestDto,
  ): Promise<AuthLoginResponseDto> {
    try {
      const accessToken = await this.authService.handleGoogleLogin(
        authLoginGoogleRequestDto,
      );
      return { access_token: accessToken };
    } catch {
      throw new HttpException('Internal Serveur Error', 500);
    }
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: getUserResponseDto })
  status(@Req() req: Request): getUserResponseDto {
    return req.user as getUserResponseDto;
  }

  @Post('register')
  async register(@Body() authRegisterRequestApiDto: AuthRegisterRequestDto) {
    const registerUser = await this.authService.createUser(
      authRegisterRequestApiDto,
    );
    if (!registerUser) {
      return 'User already exists';
    } else {
      return 'User created';
    }
  }
}
