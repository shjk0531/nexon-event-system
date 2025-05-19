import { IsEmail } from 'class-validator';
import { IsEnum, IsString, MinLength } from 'class-validator';
import { Role } from 'common/constants/role.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  password: string;

  @IsEnum(Role)
  role: Role;
}

export class CreateUserResponseDto {
  email: string;
  role: Role;
}
