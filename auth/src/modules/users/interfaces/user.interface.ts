import { Role } from 'common/constants/roles.enum';

export interface User {
  _id: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
