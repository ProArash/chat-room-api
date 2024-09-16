import { Module } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { RoomModule } from './api/room/room.module';
import { MessageModule } from './api/message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    RoomModule,
    MessageModule,
  ],
})
export class AppModule {}
