import { Body, Controller, Post, Res } from "@nestjs/common";
import { AuthAuthProxyService } from "proxy/auth/auth-auth-proxy.service";
import { Public } from "common/decorators/public.decorator";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";
@Controller('auth/auth')
export class AuthAuthController {
  constructor(
    private readonly authAuthProxyService: AuthAuthProxyService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('login')
  async login(@Body() body: unknown, @Res({ passthrough: true }) res: Response) {

    const result = await this.authAuthProxyService.login(body);

    res.cookie('refresh_token', result.refresh_token, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: this.configService.get<number>('jwt.refreshExpiresIn'),
      path: '/',
    });

    return result.access_token;
  }
}