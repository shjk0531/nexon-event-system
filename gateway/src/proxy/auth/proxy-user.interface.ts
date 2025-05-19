import { Role } from 'modules/role/constants/role.enum';

export interface User {
  id: string;
  role: Role;
}
