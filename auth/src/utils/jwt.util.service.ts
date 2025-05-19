import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'common/constants/role.enum';
import { JwtPayload } from 'common/interfaces/jwt-payload.interface';
import { v4 as uuidv4 } from 'uuid';

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

    const msValue = this.configService.getOrThrow<number>('jwt.accessExpiresIn');
    const seconds = Math.floor(msValue / 1000);

    return this.jwtService.signAsync(payload, {
      expiresIn: seconds,
    });
  }

  async signRefreshToken(id: string): Promise<{ token: string; jti: string }> {
    const jti = uuidv4();
    const msValue = this.configService.getOrThrow<number>('jwt.refreshExpiresIn');
    const seconds = Math.floor(msValue / 1000);

    const token = await this.jwtService.signAsync(
      {sub: id} as JwtPayload,
      {
        jwtid: jti,
        expiresIn: seconds,
      }
    )

    return { token, jti };
  }

  async verify(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verifyAsync<JwtPayload>(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  decode(token: string): JwtPayload | { exp: number } {
    const decoded = this.jwtService.decode(token) as JwtPayload;
    if (!decoded) {
      throw new UnauthorizedException('Invalid token');
    }
    return decoded;
  }
}
