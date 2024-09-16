import { Module } from '@nestjs/common';
import { AuthService } from './api/auth/auth.service';
import { AuthModule } from './api/auth/auth.module';
import { ChatService } from './api/chat/chat.service';
import { ChatModule } from './api/chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { RoomService } from './api/room/room.service';
import { RoomModule } from './api/room/room.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    ChatModule,
    RoomModule,
  ],
  providers: [AuthService, ChatService, RoomService],
})
export class AppModule {}
