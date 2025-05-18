import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
/**
 * Auth 모듈
 *
 * 기능
 * - 사용자 인증 및 권한 관리
 * - JWT 토큰 생성 및 검증
 * - 로그인, 로그아웃 처리
 * - 토큰 기반 인증 처리
 */
@Module({
  imports: [
    PassportModule,
    UsersModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
