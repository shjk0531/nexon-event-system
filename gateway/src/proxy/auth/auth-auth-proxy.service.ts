import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthAuthProxyService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = configService.getOrThrow<string>('services.auth');
  }


  // auth module
  // 로그인
  async login(data: unknown) {
    const response = await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/auth/login`, data),
    );
    return response;
  }

  // TODO: 추가 API 호출 정의
}
