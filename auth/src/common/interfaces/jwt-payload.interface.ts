import { Role } from 'common/constants/roles.enum';

export interface JwtPayload {
  sub: string;
  role?: Role;
}
