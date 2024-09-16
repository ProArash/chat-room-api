import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.client';
import { Room } from '@prisma/client';
import { RoomDto } from './dto/room.dto';

@Injectable()
export class RoomService {
  constructor(private prismaService: PrismaService) {}

  async newRoom(roomDto: RoomDto, userId: number): Promise<Room> {
    const room = await this.prismaService.room.findUnique({
      where: {
        name: roomDto.name,
      },
    });
    if (room) {
      throw new ConflictException('Duplicate name for room.');
    }
    return await this.prismaService.room.create({
      data: {
        name: roomDto.name,
        ownerId: userId,
      },
    });
  }

  async getRoomMessages(roomId: number): Promise<Room> {
    await this.getRoomById(roomId);
    return await this.prismaService.room.findUnique({
      where: {
        id: roomId,
      },
      include: {
        messages: {
          select: {
            text: true,
            createdAt: true,
            updatedAt: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });
  }

  async getRoomById(roomId: number): Promise<Room> {
    const room = await this.prismaService.room.findUnique({
      where: {
        id: roomId,
      },
    });
    if (!room) {
      throw new NotFoundException('Room not found.');
    }
    return room;
  }

  async getRoomMembers(roomId: number): Promise<Room> {
    return await this.prismaService.room.findUnique({
      where: {
        id: roomId,
      },
      include: {
        members: {
          select: {
            username: true,
            messages: true,
          },
        },
      },
    });
  }

  async addUserToRoom(
    userId: number,
    roomId: number,
  ): Promise<{ message: string; data: Room }> {
    await this.getRoomById(roomId);
    const room = await this.prismaService.room.findUnique({
      where: {
        id: roomId,
        members: {
          some: {
            id: userId,
          },
        },
      },
    });
    if (room) {
      throw new ConflictException('You have already member of this room.');
    }
    const newRoom = await this.prismaService.room.update({
      where: {
        id: roomId,
      },
      data: {
        members: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        members: {
          select: {
            username: true,
          },
        },
        messages: true,
      },
    });
    return {
      message: `Joined room ${roomId}`,
      data: newRoom,
    };
  }
}
