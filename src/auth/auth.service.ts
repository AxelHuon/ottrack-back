import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { compareText, encryptText } from '../utils/crypto';
import {
  AuthLoginGoogleRequestDto,
  AuthLoginRequestDto,
  AuthRegisterRequestDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async validateUserByCredentials(
    authLoginRequestDto: AuthLoginRequestDto,
  ): Promise<string | null> {
    const { email, password: passwordRequest } = authLoginRequestDto;
    const userBdd = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!userBdd) {
      return null;
    }
    const isValid = await compareText(userBdd.password, passwordRequest);
    if (!isValid) {
      return null;
    }
    const { password, ...user } = userBdd;
    return this.jwtService.sign(user);
  }

  async handleGoogleLogin(user: AuthLoginGoogleRequestDto) {
    let userBdd = await this.prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });
    if (!userBdd) {
      const userToCreate = {
        email: user.email,
        firstName: user.firstName,
        password: '',
        profilePicture: undefined,
        lastName: user.lastName,
      };
      if (user.profilePicture) {
        // @ts-ignore
        userToCreate.profilePicture = user.profilePicture;
      }
      userBdd = await this.prisma.user.create({
        data: userToCreate,
      });
    }
    return this.jwtService.sign(userBdd);
  }

  async createUser(
    authRegisterRequestDto: AuthRegisterRequestDto,
  ): Promise<boolean | null> {
    const { email } = authRegisterRequestDto;
    const userBdd = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (userBdd) {
      return false;
    }
    const encryptedPassword = await encryptText(
      authRegisterRequestDto.password,
    );
    await this.prisma.user.create({
      data: {
        firstName: authRegisterRequestDto.firstName,
        lastName: authRegisterRequestDto.lastName,
        email: authRegisterRequestDto.email,
        password: encryptedPassword.toString(),
      },
    });
    return true;
  }
}
