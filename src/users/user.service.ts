import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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

  async getUserCollectionByEmail(email: string) {
    return this.prisma.user.findMany({
      where: {
        email: email,
      },
      omit: {
        password: true,
        refreshToken:true,
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
}
