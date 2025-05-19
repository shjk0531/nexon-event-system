import { Controller, Logger, Post, Req, Res } from "@nestjs/common";
import { Public } from "modules/jwt/decorators/public.decorator";
import { Request, Response } from "express";
import { ProxyService } from "proxy/proxy.service";

@Controller('auth/auth')
export class AuthAuthController {
  private readonly logger = new Logger(AuthAuthController.name);

  constructor(
    private readonly proxyService: ProxyService,
  ) {}

  @Public()
  @Post('login')
  async login(@Req() request: Request, @Res({ passthrough: true }) res: Response) {

    const upstream = await this.proxyService.forward(
      'auth',
      request,
      res,
    );

    const setCookie = upstream.headers['set-cookie'];
    if (setCookie) {
      res.setHeader('Set-Cookie', setCookie);
    }

    return upstream.data;
  }

  @Post('logout')
  async logout(@Req() request: Request, @Res({ passthrough: true }) res: Response) {
    const upstream = await this.proxyService.forward(
      'auth',
      request,
      res,
    );

    const setCookie = upstream.headers['set-cookie'];
    if (setCookie) {
      res.setHeader('Set-Cookie', setCookie);
    }

    return upstream.data;
  }
}