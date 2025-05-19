import { Role } from 'common/constants/role.enum';

export interface User {
  _id: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
