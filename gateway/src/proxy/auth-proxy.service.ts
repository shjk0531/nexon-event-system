import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthProxyService {
  private readonly baseUrl: string;
  constructor(
    private readonly httpService: HttpService,
    configService: ConfigService,
  ) {
    this.baseUrl = configService.getOrThrow<string>('services.auth');
  }

  // TODO: data 타입 정의
  async login(data: unknown) {
    const response = await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/auth/login`, data),
    );
    return response.data;
  }

  // TODO: 추가 API 호출 정의
}
