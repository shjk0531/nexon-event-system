import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CurrentUser } from 'common/decorators/current-user.decorator';
import { Logger } from '@nestjs/common';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  test(
    @CurrentUser() user: CurrentUser,
  ) {
    this.logger.log(user);
    return 'test';
  }

  @Get('test/user')
  testUser() {
    return 'test user';
  }

  @Get('test/operator')
  testOperator() {
    return 'test operator';
  }

  @Get('test/auditor')
  testAuditor() {
    return 'test auditor';
  }

  @Get('test/admin')
  testAdmin() {
    return 'test admin';
  }
}
