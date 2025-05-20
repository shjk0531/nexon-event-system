import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export interface ReferralTokenPayload {
  userId: string;
}

@Injectable()
export class ReferralCodeService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generate(userIdInput: string | { id: string }): string {
    const userId = typeof userIdInput === 'string' ? userIdInput : userIdInput.id;
    console.log('[ReferralCodeService] Generating referral code for userId (string):', userId);
    return this.jwtService.sign(
      { userId },
      {
        secret: this.configService.get('jwt.secret'),
        expiresIn: this.configService.get('jwt.expiresIn'),
      },
    );
  }

  decode(code: string): string {
    try {
      const payload = this.jwtService.verify<ReferralTokenPayload>(code, {
        secret: this.configService.get('jwt.secret'),
      });
      console.log('[ReferralCodeService] Decoded payload:', payload);
      if (!payload || !payload.userId) {
        console.error('[ReferralCodeService] Error: userId not found in referral code payload. Code:', code, 'Payload:', payload);
        throw new BadRequestException('Invalid referral code: userId missing');
      }
      return payload.userId;
    } catch (error) {
      console.error('[ReferralCodeService] Error decoding referral code:', code, error);
      throw new BadRequestException('Invalid referral code');
    }
  }
}
