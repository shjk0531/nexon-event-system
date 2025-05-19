import { Role } from 'common/constants/role.enum';

export interface JwtPayload {
  sub: string;
  role?: Role;
  jti?: string;
}
