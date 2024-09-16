import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { RoomService } from './room.service';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RoomDto } from './dto/room.dto';
import { UserPayload } from '../auth/UserPayload';
import { Request } from 'express';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('room')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @ApiCreatedResponse({
    description: 'Will create new room and associate userId to it.',
  })
  @ApiUnauthorizedResponse({
    description: 'Bearer token is required for this endpoint.',
  })
  @ApiConflictResponse({
    description: 'Duplicate room name is not allowed.',
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
  @ApiUnauthorizedResponse({
    description: 'Bearer token is required for this endpoint.',
  })
  @ApiNotFoundResponse({
    description: 'An exist roomId is required.',
  })
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getRoomMessages(@Param('id') roomId: string) {
    return this.roomService.getRoomMessages(Number(roomId));
  }

  @ApiOkResponse({
    description: 'return messages of a room by roomId.',
  })
  @ApiUnauthorizedResponse({
    description: 'Bearer token is required for this endpoint.',
  })
  @ApiNotFoundResponse({
    description: 'An exist roomId is required.',
  })
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Post('join/:id')
  addUserToRoom(@Param('id') roomId: string, @Req() req: Request) {
    const user: UserPayload = req['user'];
    return this.roomService.addUserToRoom(user.id, Number(roomId));
  }

  @ApiOkResponse({
    description: 'return messages of a room by roomId.',
  })
  @ApiUnauthorizedResponse({
    description: 'Bearer token is required for this endpoint.',
  })
  @ApiNotFoundResponse({
    description: 'An exist roomId is required.',
  })
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Get('members/:id')
  getRoomMembers(@Param('id') roomId: string) {
    return this.roomService.getRoomMembers(Number(roomId));
  }
}
