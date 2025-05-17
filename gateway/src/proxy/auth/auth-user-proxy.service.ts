import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { ProxyRequestService } from '../proxy-request.service';
import { User } from './proxy-user.interface';

@Injectable()
export class AuthUserProxyService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly proxyRequestService: ProxyRequestService,
  ) {
    this.baseUrl = configService.getOrThrow<string>('services.auth');
  }


  // user module
  // user 생성
  async createUser(data: unknown) {
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

  // user 조회
  async getUser(id: string) {
    const response = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/users/user/${id}`),
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

}
