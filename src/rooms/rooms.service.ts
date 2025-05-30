import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomsBodyDto } from './dto/rooms.dto';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async createRoom(createRoomDto: CreateRoomsBodyDto) {
    const { title, adminId, users = [] } = createRoomDto;

    const slug = this.generateSlug(title);

    return this.prisma.$transaction(async (tx) => {
      const room = await tx.room.create({
        data: {
          title,
          adminId,
          slug,
        },
      });

      await tx.roomUser.create({
        data: {
          userId: adminId,
          roomId: room.id,
        },
      });

      if (users.length > 0) {
        await Promise.all(
          users.map((userId) => {
            if (userId !== adminId) {
              return tx.roomUser.create({
                data: {
                  userId,
                  roomId: room.id,
                },
              });
            }
          }),
        );
      }

      return tx.room.findUnique({
        where: { id: room.id },
        include: {
          users: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                  profilePicture: true,
                  createdAt: true,
                }
              },
            },
          },
        },
      });
    });
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .concat('-', Math.random().toString(36).substring(2, 7));
  }
}
