import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.client';
import { MessageDto } from './dto/message.dto';
import { Message } from '@prisma/client';

@Injectable()
export class MessageService {
  constructor(private prismaService: PrismaService) {}

  async newMessage(
    messageDto: MessageDto,
    roomId: number,
    userId: number,
  ): Promise<Message> {
    return await this.prismaService.message.create({
      data: {
        text: messageDto.text,
        roomId,
        userId,
      },
    });
  }
}
