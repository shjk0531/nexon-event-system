import { Body, Controller, Get, Param, Patch, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Public } from "modules/jwt/decorators/public.decorator";
import { JwtAuthGuard } from "modules/jwt/guards/jwt-auth.guard";
import { ProxyService } from "proxy/proxy.service";
import { Request, Response } from "express";

@Controller('auth/users')
export class AuthUserController {
  constructor(private readonly proxyService: ProxyService) {}

  @Public()
  @Post('user')
  async createUser(@Req() request: Request, @Res({ passthrough: true }) res: Response) {
    const upstream = await this.proxyService.forward(
      'auth',
      request,
      res,
    );
    return upstream.data;
  }

  @Public()
  @Post('operator')
  async createOperator(@Req() request: Request, @Res({ passthrough: true }) res: Response) {
    const upstream = await this.proxyService.forward(
      'auth',
      request,
      res,
    );
    return upstream.data;
  }

  @Public()
  @Post('auditor')
  async createAuditor(@Req() request: Request, @Res({ passthrough: true }) res: Response) {
    const upstream = await this.proxyService.forward(
      'auth',
      request,
      res,
    );
    return upstream.data;
  }

  @Public()
  @Post('admin')
  async createAdmin( @Req() request: Request, @Res({ passthrough: true }) res: Response) {
    const upstream = await this.proxyService.forward(
      'auth',
      request,
      res,
    );
    return upstream.data;
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  async getUser(@Req() request: Request, @Res({ passthrough: true }) res: Response) {
    const upstream = await this.proxyService.forward(
      'auth',
      request,
      res,
    );
    return upstream.data;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('user')
  async updateUser( @Req() request: Request, @Res({ passthrough: true }) res: Response) {
    const upstream = await this.proxyService.forward(
      'auth',
      request,
      res,
    );
    return upstream.data;
  }


  
  
}
