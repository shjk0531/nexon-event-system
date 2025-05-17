import { Role } from 'common/constants/role.enum';

export interface User {
  id: string;
  roles: Role[];
}
