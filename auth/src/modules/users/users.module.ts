import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { RefreshToken, RefreshTokenSchema } from './schemas/refresh-token.schema';

/**
 * Users 모듈
 *
 * 기능
 * - 사용자 생성, 조회, 수정, 삭제
 * - 사용자 인증 및 권한 관리
 * - MongoDB와의 연동
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
