import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SlugService } from '../slug/slug.service';
import { UserService } from '../users/user.service';
import { CreateRoomsBodyDto, RoomsDTO } from './dto/rooms.dto';

@Injectable()
export class RoomsService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private slugService: SlugService,
  ) {}

  async createRoom(
    createRoomDto: CreateRoomsBodyDto,
  ): Promise<RoomsDTO | null> {
    const { title, adminId, users = [] } = createRoomDto;

    const slug = await this.slugService.generateUniqueSlug(title, 'room');
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

      const createdRoom = await tx.room.findUnique({
        where: { id: room.id },
        include: {
          users: {
            include: {
              user: {
                select: this.userService.userAllowFieldToReturn,
              },
            },
          },
        },
      });
      if (!createdRoom) {
        return null;
      }
      return {
        ...createdRoom,
        users: createdRoom.users.map((u) => u.user),
      };
    });
  }

  async getRoomBySlug(slug: string): Promise<RoomsDTO | null> {
    const room = await this.prisma.room.findUnique({
      where: { slug },
      include: {
        users: {
          include: {
            user: {
              select: this.userService.userAllowFieldToReturn,
            },
          },
        },
      },
    });
    if (!room) {
      return null;
    }

    return {
      ...room,
      users: room.users.map((u) => u.user),
    };
  }
}
