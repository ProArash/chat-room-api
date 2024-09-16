import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.client';
import { Message, Room } from '@prisma/client';
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

  async getRoomMessages(roomId: number): Promise<Message[]> {
    await this.getRoomById(roomId);
    return await this.prismaService.message.findMany({
      where: {
        roomId,
      },
      include: {
        user: true,
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

  async addUserToRoom(userId: number, roomId: number): Promise<Room> {
    await this.getRoomById(roomId);
    const room = await this.prismaService.room.update({
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
        members: true,
        messages: true,
      },
    });
    return room;
  }
}
