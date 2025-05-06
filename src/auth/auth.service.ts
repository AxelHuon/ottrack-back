import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from '../prisma/prisma.service';
import { UserDTO } from '../users/dto/user.dto';
import { compareText, hashText } from '../utils/crypto';
import {
  AuthCreateUserGoogleRequestDTO,
  AuthLoginRequestDTO,
  AuthLoginResponseDTO,
  AuthRegisterRequestDTO,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async generateTokens(user: UserDTO): Promise<AuthLoginResponseDTO> {
    if ('refreshToken' in user) {
      delete user.refreshToken;
    }
    const accessToken = this.jwtService.sign(user, { expiresIn: '30d' });
    const refreshToken = this.jwtService.sign(user, { expiresIn: '3m' });
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });
    return { accessToken, refreshToken };
  }

  async register(
    authRegisterRequestDTO: AuthRegisterRequestDTO,
  ): Promise<boolean | null> {
    const { email } = authRegisterRequestDTO;
    const userBdd = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (userBdd) {
      return false;
    }
    const encryptedPassword = await hashText(authRegisterRequestDTO.password);
    await this.prisma.user.create({
      data: {
        firstName: authRegisterRequestDTO.firstName,
        lastName: authRegisterRequestDTO.lastName,
        email: authRegisterRequestDTO.email,
        password: encryptedPassword.toString(),
      },
    });
    return true;
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
    user: AuthCreateUserGoogleRequestDTO,
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

  async authenticateWithGoogle(code: string): Promise<AuthLoginResponseDTO> {
    const client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'http://localhost:3000',
    );

    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new HttpException('Configuration Google manquante', 500);
    }

    try {
      const { tokens } = await client.getToken({
        code,
        redirect_uri: 'http://localhost:3000',
      });

      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token!,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      if (payload?.email) {
        const dataAuthCallbackLoginGoogle: AuthCreateUserGoogleRequestDTO = {
          email: payload?.email,
          firstName: payload.given_name || 'firstName',
          lastName: payload.family_name || 'lastName',
        };

        return await this.handleGoogleLogin(dataAuthCallbackLoginGoogle);
      } else {
        throw new HttpException('Email manquant dans le token Google', 400);
      }
    } catch (error) {
      console.error(error);
      throw new HttpException("Erreur lors de l'authentification Google", 500);
    }
  }

  /**
   * Generates a password reset token for the given user ID
   * @param userId The ID of the user requesting password reset
   * @returns The generated reset token string
   */
  async generatePasswordResetToken(userId: string): Promise<string> {
    // Generate a random 32 byte token
    const buffer = randomBytes(32);
    const token = buffer.toString('hex');

    // Set token expiration to 10 minutes from now
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Delete any existing reset tokens for this user
    await this.prisma.passwordResetToken.deleteMany({
      where: { userId },
    });

    // Create new password reset token record
    await this.prisma.passwordResetToken.create({
      data: {
        token,
        expiresAt,
        userId,
      },
    });

    return token;
  }

  /**
   * Verifies if a password reset token is valid and not expired
   * @param token The token string to verify
   * @returns True if token is valid, false otherwise
   */
  async verifyPasswordResetToken(token: string): Promise<boolean> {
    // Check if token exists in database
    const tokenRecord = await this.prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!tokenRecord) {
      return false;
    }

    // Check if token has expired
    if (new Date() > tokenRecord.expiresAt) {
      // Delete expired token
      await this.prisma.passwordResetToken.delete({ where: { token } });
      return false;
    }

    return true;
  }

  /**
   * Invalidates any existing password reset tokens for a user
   * @param userId The ID of the user whose tokens should be invalidated
   */
  async invalidatePasswordResetToken(userId: string): Promise<void> {
    // Delete all reset tokens for the given user
    await this.prisma.passwordResetToken.deleteMany({
      where: { userId },
    });
  }
}
