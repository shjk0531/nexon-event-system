import { Body, Controller, Post } from '@nestjs/common';
import { AuthProxyService } from '../proxy/auth-proxy.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authProxyService: AuthProxyService) {}

  @Public()
  @Post('login')
  // TODO: data 타입 정의
  async login(@Body() body: unknown) {
    return this.authProxyService.login(body);
  }
}
