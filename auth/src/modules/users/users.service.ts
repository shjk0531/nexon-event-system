import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { CreateUserDto, CreateUserResponseDto } from './dto/create-user-dto';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from './schemas/refresh-token.schema';
import { HashUtil } from 'utils/hash.util.service';
import { JwtUtil } from 'utils/jwt.util.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) 
    private readonly userModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshToken>,
    private readonly configService: ConfigService,
    private readonly hashUtil: HashUtil,
    private readonly jwtUtil: JwtUtil,
  ) {}

  /**
   * 새로운 사용자 생성
   * @param email - 사용자 이메일
   * @param password - 사용자 비밀번호
   * @param role - 사용자 역할
   * @returns body: { email: string; password: string; role: user | operator | auditor | admin }
   * @throws ConflictException - 이메일이 이미 존재하는 경우
   */
  async create(createUserDto: CreateUserDto): Promise<CreateUserResponseDto> {
    const existingUser = await this.userModel.findOne({ email: createUserDto.email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const saltRounds = Number(
      this.configService.getOrThrow<number>('bcrypt.saltRounds', 10),
    );
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    const newUser = new this.userModel({
      email: createUserDto.email,
      password: hashedPassword,
      role: createUserDto.role,
    });
    await newUser.save();

    return {
      email: newUser.email,
      role: newUser.role,
    };
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
   * ID로 특정 사용자를 조회
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
   * 이메일로 사용자를 조회
   * @param email - 사용자 이메일
   * @returns body: { email: string; password: string; role: user | operator | auditor | admin }
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  /**
   * 사용자 정보를 업데이트
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
   * 사용자 검증
   * @param email - 사용자 이메일
   * @param password - 사용자 비밀번호
   * @returns body: { email: string; password: string; role: user | operator | auditor | admin }
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;
    const match = await this.hashUtil.compare(password, user.password);
    if (match) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  /**
   * refresh token 생성
   * @param userId - 사용자 ID
   * @returns { userId: string, token: string, isUsed: boolean, expiresAt: Date }
   */
  async createRefreshToken(userId: string): Promise<string> {
    const {token, jti} = await this.jwtUtil.signRefreshToken(userId);

    const decoded = this.jwtUtil.decode(token) as unknown as { exp: number };
    const expiresDate = new Date(decoded.exp * 1000);

   await this.refreshTokenModel.create({
      userId: userId,
      jti: jti,
      expiresAt: expiresDate,
    });

    return token;
  }

  /**
   * 사용자의 사용 가능한 refresh token을 조회
   * @param userId - 사용자 ID
   * @returns { userId: string, token: string, isUsed: boolean, expiresAt: Date }
   */
  async findRefreshToken(userId: string): Promise<RefreshToken | null> {
    return this.refreshTokenModel.findOne({ userId, isUsed: false }).exec();
  }

  /**
   * 기존 refresh token을 사용 처리 
   * @param userId - 사용자 ID
   * @param jti - 사용할 refresh token의 jti
   */
  async useRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const payload = await this.jwtUtil.verify(refreshToken);
    if (payload.sub !== userId) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    await this.refreshTokenModel.findOneAndUpdate({ userId, jti: payload.jti, isUsed: false }, { isUsed: true }).exec();
  }

  /**
   * 사용자의 refresh token 검증
   * @param userId - 사용자 ID
   * @param refreshToken - 사용자의 refresh token
   * @returns { userId: string, token: string, isUsed: boolean, expiresAt: Date }
   */
  async verifyRefreshToken(userId: string, refreshToken: string): Promise<RefreshToken | null> {
    const payload = await this.jwtUtil.verify(refreshToken);
    if (payload.sub !== userId) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return this.refreshTokenModel.findOne({ userId, jti: payload.jti, isUsed: false }).exec();
  }
}

