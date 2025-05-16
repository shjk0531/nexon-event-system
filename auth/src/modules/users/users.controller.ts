import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from 'common/decorators/roles.decorator';
import { Role } from 'common/constants/roles.enum';
import { CreateUserResponseDto } from './dto/create-user-dto';
import { User } from './schemas/user.schema';
import { CurrentUser } from 'common/decorators/user.decorator';
import { Public } from 'common/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * USER 생성
   * @param createUserDto - 사용자 생성에 필요한 데이터
   * @returns body: { email: string; password: string; role: user }
   */
  @Public()
  @Post('user')
  createUser(
    @Body() createUserDto: { email: string; password: string },
  ): Promise<CreateUserResponseDto> {
    return this.usersService.create({
      email: createUserDto.email,
      password: createUserDto.password,
      role: Role.USER,
    });
  }

  /**
   * OPERATOR 생성
   * @param createUserDto - 사용자 생성에 필요한 데이터
   * @returns body: { email: string; password: string; role: operator }
   *
   * TODO: 생성자 권한 추가가
   */
  @Public()
  @Post('operator')
  createOperator(
    @Body() createUserDto: { email: string; password: string },
  ): Promise<CreateUserResponseDto> {
    return this.usersService.create({
      email: createUserDto.email,
      password: createUserDto.password,
      role: Role.OPERATOR,
    });
  }

  /**
   * AUDITOR 생성
   * @param createUserDto - 사용자 생성에 필요한 데이터
   * @returns body: { email: string; password: string; role: auditor }
   *
   * TODO: 생성자 권한 추가가
   */
  @Public()
  @Post('auditor')
  createAuditor(
    @Body() createUserDto: { email: string; password: string },
  ): Promise<CreateUserResponseDto> {
    return this.usersService.create({
      email: createUserDto.email,
      password: createUserDto.password,
      role: Role.AUDITOR,
    });
  }

  /**
   * ADMIN 생성
   * @param createUserDto - 사용자 생성에 필요한 데이터
   * @returns body: { email: string; password: string; role: admin }
   *
   * TODO: 생성자 권한 추가가
   */
  @Public()
  @Post('admin')
  createAdmin(
    @Body() createUserDto: { email: string; password: string },
  ): Promise<CreateUserResponseDto> {
    return this.usersService.create({
      email: createUserDto.email,
      password: createUserDto.password,
      role: Role.ADMIN,
    });
  }

  /**
   * 모든 사용자 목록 조회
   * @returns body: { email: string; password: string; role: user | operator | auditor | admin }[]
   * @requires ADMIN 권한
   *
   * TODO: 개발 환경에서만 사용
   */
  @Get('user')
  @Roles(Role.ADMIN)
  findAll(): Promise<CreateUserResponseDto[]> {
    return this.usersService.findAll();
  }

  /**
   * ID로 특정 사용자 조회
   * @param id - 사용자 ID
   * @returns body: { email: string; password: string; role: user | operator | auditor | admin }
   * @requires ADMIN 권한 또는 본인 정보 조회
   */
  @Get('user/:id')
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string): Promise<CreateUserResponseDto> {
    return this.usersService.findById(id);
  }

  /**
   * 사용자 정보 업데이트
   * @param id - 사용자 ID
   * @param updateUserDto - 업데이트할 사용자 데이터
   * @returns body: { email: string; password: string; role: user | operator | auditor | admin }
   * @requires ADMIN 권한 또는 본인 정보 수정
   */
  @Patch('user')
  @Roles(Role.ADMIN)
  update(
    @CurrentUser('userId') userId: string,
    @CurrentUser('roles') roles: string[],
    @Body() updateUserDto: Partial<User>,
  ): Promise<CreateUserResponseDto> {
    console.log(userId, roles);
    return this.usersService.update(userId, updateUserDto);
  }

  /**
   * 사용자 삭제
   * @param id - 사용자 ID
   * @returns body: { email: string; password: string; role: user | operator | auditor | admin }
   * @requires ADMIN 권한
   */
  @Delete('user')
  @Roles(Role.ADMIN)
  remove(
    @CurrentUser('userId') userId: string,
    @CurrentUser('roles') roles: string[],
  ): Promise<CreateUserResponseDto> {
    console.log(userId, roles);
    return this.usersService.remove(userId);
  }
}
