import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { ProxyRequestService } from './proxy-request.service';
import { User } from './proxy-user.interface';

@Injectable()
export class AuthProxyService {
  private readonly baseUrl: string;
  private readonly logger = new Logger(AuthProxyService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly proxyRequestService: ProxyRequestService,
  ) {
    this.baseUrl = configService.getOrThrow<string>('services.auth');
  }

  // auth test
  async getHello() {
    this.logger.log('AuthProxyService: getHello');
    const response = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}`),
    );
    return response.data;
  }

  // user module
  // user 생성
  async createUser(data: unknown) {
    this.logger.log('AuthProxyService: createUser', data);
    this.logger.log('AuthProxyService: url', `${this.baseUrl}/users/user`);
    const response = await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/users/user`, data),
    );
    return response.data;
  }

  // operator 생성
  async createOperator(data: unknown) {
    const response = await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/users/operator`, data),
    );
    return response.data;
  }

  // auditor 생성
  async createAuditor(data: unknown) {
    const response = await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/users/auditor`, data),
    );
    return response.data;
  }

  // admin 생성
  async createAdmin(data: unknown) {
    const response = await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/users/admin`, data),
    );
    return response.data;
  }

  // user 업데이트
  async updateUser(dto: unknown) {
    return this.proxyRequestService.request<unknown>(
      'PATCH',
      `/users/user`,
      undefined,
      dto,
    );
  }

  // user 삭제
  async deleteUser(dto: unknown) {
    return this.proxyRequestService.request<unknown>(
      'DELETE',
      `/users/user`,
      undefined,
      dto,
    );
  }

  // auth module
  // 로그인
  async login(data: unknown) {
    const response = await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/auth/login`, data),
    );
    return response.data;
  }

  // TODO: 추가 API 호출 정의
}
