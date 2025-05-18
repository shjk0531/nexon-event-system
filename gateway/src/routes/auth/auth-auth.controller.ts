import { Body, Controller, Post, Res } from "@nestjs/common";
import { AuthAuthProxyService } from "proxy/auth/auth-auth-proxy.service";
import { Public } from "common/decorators/public.decorator";
import { response, Response } from "express";
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

    return result;
  }
}