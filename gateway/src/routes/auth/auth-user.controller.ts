import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Public } from "modules/jwt/decorators/public.decorator";
import { JwtAuthGuard } from "modules/jwt/guards/jwt-auth.guard";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "modules/role/guards/roles.guard";
import { ProxyService } from "proxy/proxy.service";
import { Request, Response } from "express";
import { Roles } from "modules/role/decorators/roles.decorator";
import { Role } from "modules/role/constants/role.enum";

@Controller('auth/users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
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
  
  @Get('user/:id')
  @Roles(Role.ADMIN)
  async getUser(@Req() request: Request, @Res({ passthrough: true }) res: Response) {
    const upstream = await this.proxyService.forward(
      'auth',
      request,
      res,
    );
    return upstream.data;
  }

  @Roles(Role.USER, Role.OPERATOR, Role.AUDITOR, Role.ADMIN)
  @Patch('user')
  async updateUser( @Req() request: Request, @Res({ passthrough: true }) res: Response) {
    const upstream = await this.proxyService.forward(
      'auth',
      request,
      res,
    );
    return upstream.data;
  }

  @Roles(Role.ADMIN)
  @Get('users')
  async getUsers(@Req() request: Request, @Res({ passthrough: true }) res: Response) {
    const upstream = await this.proxyService.forward(
      'auth',
      request,
      res,
    );
    return upstream.data;
  }

  @Roles(Role.ADMIN)
  @Delete('user/:id')
  async deleteUser(@Req() request: Request, @Res({ passthrough: true }) res: Response) {
    const upstream = await this.proxyService.forward(
      'auth',
      request,
      res,
    );
    return upstream.data;
  }

  @Roles(Role.USER, Role.OPERATOR, Role.AUDITOR, Role.ADMIN)
  @Get('me')
  async getMe(@Req() request: Request, @Res({ passthrough: true }) res: Response) {
    const upstream = await this.proxyService.forward(
      'auth',
      request,
      res,
    );
    return upstream.data;
  }

  @Roles(Role.USER, Role.OPERATOR, Role.AUDITOR, Role.ADMIN)
  @Delete('me')
  async deleteMe(@Req() request: Request, @Res({ passthrough: true }) res: Response) {
    const upstream = await this.proxyService.forward(
      'auth',
      request,
      res,
    );
    return upstream.data;
  }
}
