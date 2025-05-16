import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { AuthProxyService } from 'proxy/auth-proxy.service';
import { Public } from 'common/decorators/public.decorator';
import { JwtAuthGuard } from 'modules/jwt/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authProxyService: AuthProxyService) {}

  @Public()
  @Get()
  async getHello() {
    this.logger.log('AuthController: getHello');
    return this.authProxyService.getHello();
  }

  @Public()
  @Post('users/user')
  async createUser(@Body() body: unknown) {
    return this.authProxyService.createUser(body);
  }

  @Public()
  @Post('users/operator')
  async createOperator(@Body() body: unknown) {
    return this.authProxyService.createOperator(body);
  }

  @Public()
  @Post('users/auditor')
  async createAuditor(@Body() body: unknown) {
    return this.authProxyService.createAuditor(body);
  }

  @Public()
  @Post('users/admin')
  async createAdmin(@Body() body: unknown) {
    return this.authProxyService.createAdmin(body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('users/user')
  async updateUser(@Body() body: unknown) {
    return this.authProxyService.updateUser(body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('users/user')
  async deleteUser(@Body() body: unknown) {
    return this.authProxyService.deleteUser(body);
  }

  @Public()
  @Post('auth/login')
  // TODO: data 타입 정의
  async login(@Body() body: unknown) {
    return this.authProxyService.login(body);
  }
}
