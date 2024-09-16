import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { MessageDto } from './dto/message.dto';
import { UserPayload } from '../auth/UserPayload';
import { Request } from 'express';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @ApiOkResponse({
    description: 'send new message to provided roomId.',
  })
  @UseGuards(JwtGuard)
  @Post(':id')
  newMessage(
    @Body(new ValidationPipe()) msgDto: MessageDto,
    @Param('id') roomId: string,
    @Req() req: Request,
  ) {
    const user: UserPayload = req['user'];
    return this.messageService.newMessage(msgDto, Number(roomId), user.id);
  }
}
