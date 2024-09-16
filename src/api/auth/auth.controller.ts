import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOkResponse({
    description:
      'Will return access(expires on 1 hour) and refresh token(expires on 10 days).',
  })
  @HttpCode(HttpStatus.OK)
  @Post('signIn')
  async signIn(@Body(new ValidationPipe()) authDto: AuthDto) {
    return await this.authService.signIn(authDto);
  }

  @ApiCreatedResponse({
    description:
      'Will return access(expires on 1 hour) and refresh token(expires on 10 days).',
  })
  @ApiBadRequestResponse({
    description: 'Valid auth schema is required.',
  })
  @Post('signUp')
  async signUp(@Body(new ValidationPipe()) authDto: AuthDto) {
    return await this.authService.signUp(authDto);
  }

  @ApiOkResponse({
    description: 'Will generate new access token from valid refresh token.',
  })
  @ApiBadRequestResponse({
    description: 'Valid auth schema is required.',
  })
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refreshToken(@Body(new ValidationPipe()) refreshDto: RefreshDto) {
    return await this.authService.refreshToken(refreshDto);
  }
}
