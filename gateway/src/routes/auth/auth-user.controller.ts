import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { Public } from "modules/jwt/decorators/public.decorator";
import { JwtAuthGuard } from "modules/jwt/guards/jwt-auth.guard";
import { AuthUserProxyService } from "proxy/auth/auth-user-proxy.service";

@Controller('auth/users')
export class AuthUserController {
  constructor(private readonly authUserProxyService: AuthUserProxyService) {}

  @Public()
  @Post('user')
  async createUser(@Body() body: unknown) {
    return this.authUserProxyService.createUser(body);
  }

  @Public()
  @Post('operator')
  async createOperator(@Body() body: unknown) {
    return this.authUserProxyService.createOperator(body);
  }

  @Public()
  @Post('auditor')
  async createAuditor(@Body() body: unknown) {
    return this.authUserProxyService.createAuditor(body);
  }

  @Public()
  @Post('admin')
  async createAdmin(@Body() body: unknown) {
    return this.authUserProxyService.createAdmin(body);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  async getUser(@Param('id') id: string) {
    return this.authUserProxyService.getUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('user')
  async updateUser(@Body() body: unknown) {
    return this.authUserProxyService.updateUser(body);
  }

  
  
  
}
