import { Module } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { PassportConfigModule } from '../common/modules/passport/passport.module';
import { JwtConfigModule } from '../common/modules/jwt/jwt.module';

@Module({
  imports: [PassportConfigModule, JwtConfigModule],
  providers: [JwtStrategy],
  exports: [PassportConfigModule, JwtConfigModule],
})
export class AuthModule {}
