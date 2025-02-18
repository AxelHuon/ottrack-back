import { Injectable } from '@nestjs/common';
import { AuthRegisterRequestDTO } from '../auth/dto/auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { hashText } from '../utils/crypto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.user.findMany({
      omit: {
        password: true,
      },
    });
  }

  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
      omit: {
        password: true,
      },
    });
  }

  async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
      omit: {
        password: true,
      },
    });
  }
  async createUser(
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
}
