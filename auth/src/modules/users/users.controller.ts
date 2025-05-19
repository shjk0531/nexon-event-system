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
import { Role } from 'common/constants/role.enum';
import { CreateUserResponseDto } from './dto/create-user-dto';
import { User } from './schemas/user.schema';
import { CurrentUser } from 'common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * USER 생성
   * @param createUserDto - 사용자 생성에 필요한 데이터
   * @returns body: { email: string; password: string; role: user }
   */
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
  update(
    @CurrentUser() user: CurrentUser,
    @Body() updateUserDto: Partial<User>,
  ): Promise<CreateUserResponseDto> {
    return this.usersService.update(user.id, updateUserDto);
  }

  /**
   * 사용자 삭제
   * @param id - 사용자 ID
   * @returns body: { email: string; password: string; role: user | operator | auditor | admin }
   * @requires ADMIN 권한
   */
  @Delete('user')
  remove(
    @CurrentUser() user: CurrentUser,
  ): Promise<CreateUserResponseDto> {
    return this.usersService.remove(user.id);
  }
}
