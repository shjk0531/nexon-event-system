import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { Role } from 'common/constants/roles.enum';
import { CreateUserResponseDto } from './dto/create-user-dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 새로운 사용자 생성
   * @param email - 사용자 이메일
   * @param password - 사용자 비밀번호
   * @param role - 사용자 역할
   * @returns body: { email: string; password: string; role: user | operator | auditor | admin }
   * @throws ConflictException - 이메일이 이미 존재하는 경우
   */
  async create({
    email,
    password,
    role,
  }: {
    email: string;
    password: string;
    role: Role;
  }): Promise<CreateUserResponseDto> {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    const newUser = new this.userModel({ email, password, role });
    await newUser.save();

    return { email, role };
  }

  /**
   * 모든 사용자 목록 조회
   *
   * @returns body: { email: string; password: string; role: user | operator | auditor | admin }[]
   *
   * TODO: 개발 환경에서만 사용
   */
  async findAll(): Promise<User[]> {
    if (this.configService.get<string>('NODE_ENV') !== 'development') {
      throw new ForbiddenException('개발 환경에서만 사용 가능합니다.');
    }

    return this.userModel.find().exec();
  }

  /**
   * ID로 특정 사용자를 조회합니다.
   * @param id - 사용자 ID
   * @returns body: { email: string; password: string; role: user | operator | auditor | admin }
   * @throws NotFoundException - 사용자를 찾을 수 없는 경우
   */
  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    return user;
  }

  /**
   * 이메일로 사용자를 조회합니다.
   * @param email - 사용자 이메일
   * @returns body: { email: string; password: string; role: user | operator | auditor | admin }
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  /**
   * 사용자 정보를 업데이트합니다.
   * @param id - 사용자 ID
   * @param updateUserDto - 업데이트할 사용자 데이터
   * @returns body: { email: string; password: string; role: user | operator | auditor | admin }
   * @throws NotFoundException - 사용자를 찾을 수 없는 경우
   */
  async update(id: string, updateUserDto: Partial<User>): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    return updatedUser;
  }

  /**
   * 사용자 삭제
   * @param id - 사용자 ID
   * @returns body: { email: string; password: string; role: user | operator | auditor | admin }
   * @throws NotFoundException - 사용자를 찾을 수 없는 경우
   */
  async remove(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    return deletedUser;
  }

  /**
   * 사용자의 refresh token을 업데이트합니다.
   * @param userId - 사용자 ID
   * @param refreshToken - 새로운 refresh token
   * @returns body: { email: string; password: string; role: user | operator | auditor | admin }
   */
  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, { refreshToken }, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    return updatedUser;
  }
}
