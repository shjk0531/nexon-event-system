// src/gateway/controllers/claim.controller.ts

import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  Body,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ProxyService } from 'proxy/proxy.service';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'modules/role/guards/roles.guard';
import { Roles } from 'modules/role/decorators/roles.decorator';
import { Role } from 'modules/role/constants/role.enum';

@Controller('event/claims')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class EventClaimController {
  constructor(private readonly proxyService: ProxyService) {}

  /** 보상 요청 생성 (USER) */
  @Post()
  @Roles(Role.USER, Role.ADMIN)
  async create(
    @Body() body: unknown,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const upstream = await this.proxyService.forward('event', req, res);
    return upstream.data;
  }

  /**
   * 특정 유저의 특정 이벤트 보상 요청 조회 
   */
  @Get('admin')
  @Roles(Role.AUDITOR, Role.ADMIN)
  async findAllClaimsByUserId(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const upstream = await this.proxyService.forward('event', req, res);
    return upstream.data;
  }

  /** 
   * 내 보상 요청 조회 
   */
  @Get('/:eventId')
  @Roles(Role.USER, Role.ADMIN)
  async findOne(
    @Param('eventId') eventId: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const upstream = await this.proxyService.forward('event', req, res);
    return upstream.data;
  }

  /** 전체 보상 요청 조회 (OPERATOR, AUDITOR, ADMIN) */
  @Get()
  @Roles(Role.AUDITOR, Role.ADMIN)
  async findAll(
    @Query() query: unknown,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const upstream = await this.proxyService.forward('event', req, res);
    return upstream.data;
  }
}
