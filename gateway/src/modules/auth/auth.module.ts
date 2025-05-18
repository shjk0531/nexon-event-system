import { Module } from '@nestjs/common';
import { PassportConfigModule } from 'modules/passport/passport.module';
import { JwtConfigModule } from 'modules/jwt/jwt.module';

@Module({
  imports: [PassportConfigModule, JwtConfigModule],
  exports: [PassportConfigModule, JwtConfigModule],
})
export class AuthModule {}
