import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Role } from 'common/constants/role.enum';
import { Observable } from 'rxjs';

@Injectable()
export class OwnershipGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const params = request.params;

    if (user.role === Role.ADMIN) {
      return true;
    }

    return user.id === params.id;
  }
}
