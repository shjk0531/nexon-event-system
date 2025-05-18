import { Body, Controller, Post, UseGuards, Res, Req, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { LoginDto, LoginResponse } from './dto/login.dto';
import { Public } from 'common/decorators/public.decorator';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 로그인
   * @param dto body: { email: string, password: string }
   * @returns body: { access_token: string }
   */
  @Public()
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) : Promise<LoginResponse> {
    const result = await this.authService.login(dto);


    res.cookie('refresh_token', result.refresh_token, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: this.configService.get<number>('jwt.refreshExpiresIn'),
      path: '/',
    });

    return {
      access_token: result.access_token,
    };
  }

  /**
   * 토큰 재발급
   * @param req - refresh token
   * @returns 토큰 재발급 결과
   */
  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const tokens = await this.authService.rotateTokens(refreshToken);

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: this.configService.get<number>('jwt.refreshExpiresIn'),
      path: '/',
    });

    return {
      access_token: tokens.access_token,
    };
  }
}
