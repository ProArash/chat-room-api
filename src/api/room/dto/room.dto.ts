import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RoomDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}
