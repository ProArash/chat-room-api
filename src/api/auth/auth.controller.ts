import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOkResponse({
    description: 'Will return access and refresh token.',
  })
  @Post('signIn')
  async signIn(@Body(new ValidationPipe()) authDto: AuthDto) {
    return await this.authService.signIn(authDto);
  }

  @ApiOkResponse({
    description: 'Will return access and refresh token.',
  })
  @Post('signUp')
  async signUp(@Body(new ValidationPipe()) authDto: AuthDto) {
    return await this.authService.signUp(authDto);
  }

  @ApiOkResponse({
    description: 'Will generate new access token from valid refresh token.',
  })
  @Post('refresh')
  async refreshToken(@Body(new ValidationPipe()) refreshDto: RefreshDto) {
    return await this.authService.refreshToken(refreshDto);
  }
}
