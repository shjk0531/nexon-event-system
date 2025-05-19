import { Controller, Post, Req, Res } from "@nestjs/common";
import { Get } from "@nestjs/common";
import { ProxyService } from "proxy/proxy.service";
import { request, Request, Response } from "express";
import { Role } from "modules/role/constants/role.enum";
import { Roles } from "modules/role/decorators/roles.decorator";

@Controller('event')
export class EventController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get('test')
  async test(@Req() request: Request, @Res({ passthrough: true }) res: Response) {
    const upstream = await this.proxyService.forward(
      'event',
      request,
      res,
    );

    return upstream.data;
  }

  @Roles(Role.USER)
  @Get('test/user')
  async testUser(@Req() request: Request, @Res({ passthrough: true }) res: Response) {
    const upstream = await this.proxyService.forward(
      'event',
      request,
      res,
    );

    return upstream.data;
  }

  @Roles(Role.OPERATOR)
  @Get('test/operator')
  async testOperator(@Req() request: Request, @Res({ passthrough: true }) res: Response) {
    const upstream = await this.proxyService.forward(
      'event',
      request,
      res,
    );

    return upstream.data;
  }

  @Roles(Role.AUDITOR)
  @Get('test/auditor')
  async testAuditor(@Req() request: Request, @Res({ passthrough: true }) res: Response) {
    const upstream = await this.proxyService.forward(
      'event',
      request,
      res,
    );

    return upstream.data;
  }

  @Roles(Role.ADMIN)
  @Get('test/admin')
  async testAdmin(@Req() request: Request, @Res({ passthrough: true }) res: Response) {
    const upstream = await this.proxyService.forward(
      'event',
      request,
      res,
    );

    return upstream.data;
  }
}
