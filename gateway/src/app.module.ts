import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ProxyModule } from './proxy/proxy.module';
import { JwtAuthGuard } from './modules/jwt/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { AuthAuthController } from './routes/auth/auth-auth.controller';
import { AuthUserController } from './routes/auth/auth-user.controller';
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [configuration],
    }),
    AuthModule,
    ProxyModule,
  ],
  controllers: [AppController, AuthAuthController, AuthUserController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
