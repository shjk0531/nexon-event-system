import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  password: string;
}

export class LoginResponseDto {
  @IsString()
  accessToken: string;
}

export class LoginResponse {
  @IsString()
  access_token: string;

  @IsString()
  refresh_token: string;
}