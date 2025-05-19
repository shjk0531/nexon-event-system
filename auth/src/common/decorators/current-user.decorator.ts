import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from '../constants/role.enum';

export interface CurrentUser {
  id: string;
  role: Role;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) : CurrentUser | undefined => {
    const request = ctx.switchToHttp().getRequest<{ user: CurrentUser }>();
    return request.user;
  },
);
