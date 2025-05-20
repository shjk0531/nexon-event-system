import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';
import { ProxyModule } from 'proxy/proxy.module';
import { JwtAuthGuard } from 'modules/jwt/guards/jwt-auth.guard';
import { RolesGuard } from 'modules/role/guards/roles.guard';
import { AuthAuthController } from 'routes/auth/auth-auth.controller';
import { AuthUserController } from 'routes/auth/auth-user.controller';
import { JwtConfigModule } from 'modules/jwt/jwt.module';
import { PassportModule } from '@nestjs/passport';
import { EventEventController } from 'routes/event/event-event.controller';
import { EventClaimController } from 'routes/event/event-claim.controller';
import { EventPaymentController } from 'routes/event/event-payment.controller';
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [configuration],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ProxyModule,
    JwtConfigModule,
  ],
  
  controllers: [
    AuthAuthController,
    AuthUserController,
    EventEventController,
    EventClaimController,
    EventPaymentController,
  ],
  providers: [
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
