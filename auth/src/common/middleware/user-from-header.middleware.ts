import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Role } from 'common/constants/role.enum';

@Injectable()
export class UserFromHeaderMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const id = req.header('x-user-id');
    const role = req.header('x-user-role') as Role | undefined;
    if (id && role) {
      req.user = { id, role };
    }
    next();
  }
}
