import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'modules/jwt/decorators/public.decorator';
import { ProxyService } from 'proxy/proxy.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { Request, Response } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    private reflector: Reflector,
    private proxyService: ProxyService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { super(); }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req  = context.switchToHttp().getRequest< Request & {
      cookies: Record<string,string>,
      user?: any,
      isPublic?: boolean
    }>();
    const res  = context.switchToHttp().getResponse<Response>();
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      req.isPublic = true;
      return true;
    }

    await super.canActivate(context) as boolean;

    const authHeader = req.headers['authorization'] as string;
    if (!authHeader) throw new UnauthorizedException('Access token missing');
    const token   = authHeader.replace(/^Bearer\s*/, '');
    const decoded = this.jwtService.decode(token) as JwtPayload & { exp?: number };

    // access token 만료 시 token refresh
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      const rt = req.cookies['refresh_token'];
      if (!rt) throw new UnauthorizedException('Refresh token not found');

      const refreshReq = {
        url:    '/auth/refresh',
        method: 'POST',
        headers: {
          ...req.headers,
          cookie: `refresh_token=${rt}`,
        },
        query:   {},
        body:    {},
        cookies: req.cookies,
        user:    req.user,
        isPublic: true,
      } as unknown as Request;

      const refreshRes = await this.proxyService.forward('auth', refreshReq, res);
      const newAt = refreshRes.data.access_token as string;

      const newPayload = this.jwtService.verify<JwtPayload>(newAt);
      req.user = { id: newPayload.sub, role: newPayload.role };
      req.headers['authorization'] = `Bearer ${newAt}`;
      res.setHeader('x-access-token', newAt);

      this.logger.log('Access token refreshed via gateway');
    }

    await super.canActivate(context) as boolean;
    return true;
  }
}
