// src/gateway/controllers/event.controller.ts

import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
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
  
  @Controller('event/events')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  export class EventEventController {
    constructor(private readonly proxyService: ProxyService) {}

    /** 달력 조회 (USER) */
    @Get('calendar')
    @Roles(Role.USER)
    async calendar(
      @Query('month') month: string,
      @Req() req: Request,
      @Res({ passthrough: true }) res: Response,
    ) {
      const upstream = await this.proxyService.forward('event', req, res);
      return upstream.data;
    }

    /** 추천인 아이디 조회 (USER) */
    @Get('referrerId')
    @Roles(Role.USER)
    async referrerId(
      @Req() req: Request,
      @Res({ passthrough: true }) res: Response,
    ) {
      const upstream = await this.proxyService.forward('event', req, res);
      return upstream.data;
    }


    /** 이벤트 생성 (OPERATOR, ADMIN) */
    @Post()
    @Roles(Role.OPERATOR, Role.ADMIN)
    async create(
      @Body() body: unknown,
      @Req() req: Request,
      @Res({ passthrough: true }) res: Response,
    ) {
      const upstream = await this.proxyService.forward('event', req, res);
      return upstream.data;
    }
  
    /** 이벤트 목록 조회 (OPERATOR, ADMIN) */
    @Get()
    @Roles(Role.OPERATOR, Role.ADMIN)
    async findAll(
      @Req() req: Request,
      @Res({ passthrough: true }) res: Response,
    ) {
      const upstream = await this.proxyService.forward('event', req, res);
      return upstream.data;
    }
  
    /** 이벤트 상세 조회 (OPERATOR, ADMIN) */
    @Get(':id')
    @Roles(Role.OPERATOR, Role.ADMIN)
    async findOne(
      @Param('id') id: string,
      @Req() req: Request,
      @Res({ passthrough: true }) res: Response,
    ) {
      const upstream = await this.proxyService.forward('event', req, res);
      return upstream.data;
    }
  
    /** 이벤트 수정 (OPERATOR, ADMIN) */
    @Patch(':id')
    @Roles(Role.OPERATOR, Role.ADMIN)
    async update(
      @Param('id') id: string,
      @Body() body: unknown,
      @Req() req: Request,
      @Res({ passthrough: true }) res: Response,
    ) {
      const upstream = await this.proxyService.forward('event', req, res);
      return upstream.data;
    }
  
    /** 이벤트 삭제 (OPERATOR, ADMIN) */
    @Delete(':id')
    @Roles(Role.OPERATOR, Role.ADMIN)
    async remove(
      @Param('id') id: string,
      @Req() req: Request,
      @Res({ passthrough: true }) res: Response,
    ) {
      const upstream = await this.proxyService.forward('event', req, res);
      return upstream.data;
    }
  
    /** 이벤트 보상 추가 (OPERATOR, ADMIN) */
    @Post(':id/rewards')
    @Roles(Role.OPERATOR, Role.ADMIN)
    async addReward(
      @Param('id') id: string,
      @Body() body: unknown,
      @Req() req: Request,
      @Res({ passthrough: true }) res: Response,
    ) {
      const upstream = await this.proxyService.forward('event', req, res);
      return upstream.data;
    }
  

  }
  