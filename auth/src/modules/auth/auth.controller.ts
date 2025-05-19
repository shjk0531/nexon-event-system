import { Body, Controller, Post, UseGuards, Res, Req, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { LoginDto, LoginResponse } from './dto/login.dto';
import { Request } from 'express';
import { CurrentUser } from 'common/decorators/current-user.decorator';
import { Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Role } from 'common/constants/role.enum';
import { JwtUtil } from 'utils/jwt.util.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtUtil: JwtUtil,
  ) {}

  /**
   * 로그인
   * @param dto body: { email: string, password: string }
   * @returns body: { access_token: string }
   */
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
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const rt = req.cookies['refresh_token'];
    if (!rt) {
      throw new UnauthorizedException('Refresh token not found');
    }

    let payload: { sub: string; role?: string };
    try {
      payload = await this.jwtUtil.verify(rt);
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const { access_token, refresh_token } =
      await this.authService.rotateTokens(
        payload.sub,
        rt,
      );

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: this.configService.get<number>('jwt.refreshExpiresIn'),
      path: '/',
    });

    return { access_token };
  }

  /**
   * 로그아웃
   * @param req - refresh token
   * @returns 로그아웃 결과
   */
  @Post('logout')
  async logout(@CurrentUser() user: CurrentUser, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    this.logger.log("refreshToken", refreshToken);

    await this.usersService.useRefreshToken(user.id, refreshToken);

    res.clearCookie('refresh_token');

    return {
      message: 'Logged out successfully',
    };
  }
}
