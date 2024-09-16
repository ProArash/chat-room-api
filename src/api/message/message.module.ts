import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { PrismaService } from '../../prisma.client';
import { MessageService } from './message.service';

@Module({
  controllers: [MessageController],
  providers: [PrismaService, MessageService],
})
export class MessageModule {}
