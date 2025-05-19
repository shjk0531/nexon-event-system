import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'modules/users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtUtil } from '../../utils/jwt.util.service';
import { HashUtil } from 'utils/hash.util.service';
import { Role } from 'common/constants/role.enum';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtUtil: JwtUtil,
    private readonly hashUtil: HashUtil,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.validateUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userId = (user as any)._id.toString();

    const accessToken = await this.jwtUtil.signAccessToken(
      userId,
      user.role,
    );
    const refreshToken = await this.usersService.createRefreshToken(userId);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
  
  /**
   * 토큰 회전
   * @param userId - 사용자 ID
   * @param beforeRefreshToken - 이전 refresh token
   * @returns { access_token: string, refresh_token: string }
   */
  async rotateTokens(userId: string, userRole: Role, beforeRefreshToken: string): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    if (!beforeRefreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const refreshTokenDoc = await this.usersService.verifyRefreshToken(userId, beforeRefreshToken);
    if (!refreshTokenDoc) {
      throw new UnauthorizedException('Invalid refresh token');
    }

     await this.usersService.useRefreshToken(userId, beforeRefreshToken);


     const accessToken = await this.jwtUtil.signAccessToken(
      userId,
      userRole,
     );

     const refreshToken = await this.usersService.createRefreshToken(userId);

     return {
      access_token: accessToken,
      refresh_token: refreshToken,
     };
  }
}
