import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { Role } from 'common/constants/role.enum';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Role)
  role: Role;
}
