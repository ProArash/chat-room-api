import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.client';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { UserPayload } from './UserPayload';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    authDto: AuthDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: authDto.username,
      },
    });

    if (user && (await bcrypt.compare(authDto.password, user.password))) {
      const payload: UserPayload = {
        id: user.id,
        username: user.username,
      };
      return {
        access_token: await this.jwtService.signAsync(payload),
        refresh_token: await this.generateRefreshToken(payload),
      };
    } else {
      throw new ForbiddenException('Invalid username or password');
    }
  }

  async signUp(
    authDto: AuthDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    let user = await this.prismaService.user.findUnique({
      where: {
        username: authDto.username,
      },
    });
    if (user) {
      throw new ConflictException('Duplicate username');
    }
    user = await this.prismaService.user.create({
      data: {
        username: authDto.username,
        password: await bcrypt.hash(authDto.password, 10),
      },
    });
    const payload: UserPayload = {
      id: user.id,
      username: user.username,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.generateRefreshToken(payload),
    };
  }

  async generateRefreshToken(payload: UserPayload): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      expiresIn: '10d',
    });
  }
}
