import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (property: 'userId' | 'roles', ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: any }>();
    return property ? request.user[property] : request.user;
  },
);
