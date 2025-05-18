import { Module, Global } from '@nestjs/common';
import { JwtUtil } from './jwt.util.service';
import { HashUtil } from './hash.util.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.getOrThrow<string>('jwt.secret'),
      signOptions: {
        expiresIn: configService.getOrThrow<string>('jwt.accessExpiresIn'),
      },
    }),
  })],
  providers: [JwtUtil, HashUtil],
  exports: [JwtUtil, HashUtil],
})
export class UtilModule {}