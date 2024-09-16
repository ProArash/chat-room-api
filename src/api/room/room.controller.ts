import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { RoomDto } from './dto/room.dto';
import { UserPayload } from '../auth/UserPayload';
import { Request } from 'express';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('room')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @ApiCreatedResponse({
    description: 'Will create new room and assicoate userId to it.',
  })
  @UseGuards(JwtGuard)
  @Post()
  newRoom(@Body(new ValidationPipe()) roomDto: RoomDto, @Req() req: Request) {
    const user: UserPayload = req['user'];
    return this.roomService.newRoom(roomDto, user.id);
  }

  @ApiOkResponse({
    description: 'return messages of a room by roomId.',
  })
  @UseGuards(JwtGuard)
  @Get(':id')
  getRoomMessages(@Param('id') roomId: string) {
    return this.roomService.getRoomMessages(Number(roomId));
  }

  @ApiOkResponse({
    description: 'return messages of a room by roomId.',
  })
  @UseGuards(JwtGuard)
  @Post('join/:id')
  addUserToRoom(@Param('id') roomId: string, @Req() req: Request) {
    const user: UserPayload = req['user'];
    return this.roomService.addUserToRoom(user.id, Number(roomId));
  }

  @ApiOkResponse({
    description: 'return messages of a room by roomId.',
  })
  @UseGuards(JwtGuard)
  @Get('members/:id')
  getRoomMembers(@Param('id') roomId: string) {
    return this.roomService.getRoomMembers(Number(roomId));
  }
}
