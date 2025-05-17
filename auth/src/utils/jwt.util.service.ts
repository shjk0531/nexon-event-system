import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'common/constants/roles.enum';
import { JwtPayload } from 'common/interfaces/jwt-payload.interface';


@Injectable()
export class JwtUtil {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signAccessToken(id: string, role: Role) {
    const payload: JwtPayload = {
      sub: id,
      role: role as Role,
    };

    return this.jwtService.signAsync(payload, {
      expiresIn: this.configService.getOrThrow<string>('jwt.accessExpiresIn'),
    });
  }

  async signRefreshToken(id: string): Promise<string> {
    const payload: JwtPayload = {
      sub: id,
    };

    return this.jwtService.signAsync(payload, {
      expiresIn: this.configService.getOrThrow<string>('jwt.refreshExpiresIn'),
    });
  }

  async verify(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verifyAsync<JwtPayload>(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
