import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from 'modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtUtil } from '../../utils/jwt.util.service';
import { HashUtil } from 'utils/hash.util.service';

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

    const accessToken = await this.jwtUtil.signAccessToken(
      user.id,
      user.role,
    );
    const refreshToken = await this.jwtUtil.signRefreshToken(
      user.id,
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
  
  /**
   * 토큰 회전
   * @param beforeRefreshToken - 이전 refresh token
   * @returns { access_token: string, refresh_token: string }
   */
  async rotateTokens(beforeRefreshToken: string): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    if (!beforeRefreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const decoded = await this.jwtUtil.verify(beforeRefreshToken);
    const user = await this.usersService.findById(decoded.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
     const tokenDoc = await this.usersService.findRefreshToken(user.id);

     if (
      !tokenDoc || 
      !(await this.hashUtil.compare(tokenDoc.token, beforeRefreshToken))) {
      throw new UnauthorizedException('Invalid refresh token');
     }

     await this.usersService.useRefreshToken(user.id, tokenDoc.token);


     const accessToken = await this.jwtUtil.signAccessToken(
      user.id,
      user.role,
     );

     const refreshToken = await this.usersService.createRefreshToken(user.id);

     return {
      access_token: accessToken,
      refresh_token: refreshToken,
     };
     
  }
}
