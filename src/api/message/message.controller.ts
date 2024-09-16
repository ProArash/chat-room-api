import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { MessageService } from './message.service';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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
  @ApiUnauthorizedResponse({
    description: 'Bearer token is required for this endpoint.',
  })
  @ApiNotFoundResponse({
    description: 'An exist roomId is required.',
  })
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
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
