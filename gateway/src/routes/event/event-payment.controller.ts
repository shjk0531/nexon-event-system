import { Controller, Post, UseGuards, Req, Res, Param, Put, Body } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Roles } from "modules/role/decorators/roles.decorator";
import { RolesGuard } from "modules/role/guards/roles.guard";
import { Role } from "modules/role/constants/role.enum";
import { ProxyService } from "proxy/proxy.service";
import { Request, Response } from "express";

@Controller('event/payments')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class EventPaymentController {
  constructor(private readonly proxyService: ProxyService) {}

  @Post()
  @Roles(Role.USER)
  async createPayment(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ){
    const upstream = await this.proxyService.forward('event', req, res);
    return upstream.data;
  }

  @Put(':paymentId/status')
  @Roles(Role.USER)
  async updatePaymentStatus(
    @Param('paymentId') paymentId: string,
    @Body('status') status: void,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const upstream = await this.proxyService.forward('event', req, res);
    return upstream.data;
  }
}
