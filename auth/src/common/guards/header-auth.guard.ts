import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    roles: string[];
  };
}

@Injectable()
export class HeaderAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<RequestWithUser>();
    const userId = req.headers['x-user-id'];
    const rolesHeader = req.headers['x-user-roles'];
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    if (!userId) {
      throw new ForbiddenException('X-User-Id header is missing');
    }

    req.user = {
      userId: userId as string,
      roles: rolesHeader ? (rolesHeader as string).split(',') : [],
    };

    return true;
  }
}
