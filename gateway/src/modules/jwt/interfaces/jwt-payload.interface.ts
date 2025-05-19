import { Role } from 'modules/role/constants/role.enum';

export interface JwtPayload {
  sub: string;
  role?: Role;
}
