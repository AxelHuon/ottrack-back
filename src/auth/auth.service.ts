import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UserDTO } from '../users/dto/user.dto';
import { compareText } from '../utils/crypto';
import {
  AuthLoginGoogleRequestDTO,
  AuthLoginRequestDTO,
  AuthLoginResponseDTO,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async generateTokens(user: UserDTO): Promise<AuthLoginResponseDTO> {
    const accessToken = this.jwtService.sign(user, { expiresIn: '7d' });
    const refreshToken = this.jwtService.sign(user, { expiresIn: '30d' });
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });
    return { accessToken, refreshToken };
  }

  async validateUserByCredentials(
    authLoginRequestDTO: AuthLoginRequestDTO,
  ): Promise<AuthLoginResponseDTO | null> {
    const { email, password: passwordRequest } = authLoginRequestDTO;
    const userBdd = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!userBdd) {
      return null;
    }
    if (userBdd.password) {
      const isValid = await compareText(userBdd.password, passwordRequest);
      if (!isValid) {
        return null;
      }
    } else {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = userBdd;
    return this.generateTokens(user);
  }

  async handleGoogleLogin(
    user: AuthLoginGoogleRequestDTO,
  ): Promise<AuthLoginResponseDTO> {
    let userBdd = await this.prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });
    if (!userBdd) {
      const userToCreate = {
        email: user.email,
        password: null,
        firstName: user.firstName,
        profilePicture: user.profilePicture || null,
        lastName: user.lastName,
      };
      userBdd = await this.prisma.user.create({
        data: userToCreate,
      });
    }
    return this.generateTokens(userBdd);
  }

  async refreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<AuthLoginResponseDTO> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Refresh token invalide');
    }
    const isMatch: boolean = refreshToken === user.refreshToken;
    if (!isMatch) {
      throw new UnauthorizedException('Refresh token invalide');
    }
    return await this.generateTokens(user);
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }
}
