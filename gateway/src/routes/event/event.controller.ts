import { Controller, Post, Req, Res } from "@nestjs/common";
import { Get } from "@nestjs/common";
import { ProxyService } from "proxy/proxy.service";
import { Request, Response } from "express";

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

}
