import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { User } from './auth/proxy-user.interface';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

@Injectable()
export class ProxyRequestService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * proxy request
   *
   * @param method - http method
   * @param path - API path (End Point)
   * @param user - user (nullable)
   * @param data - data (nullable)
   */
  async request<T>(
    method: HttpMethod,
    path: string,
    user?: User,
    data?: unknown,
  ): Promise<T> {
    const baseUrl = this.configService.getOrThrow<string>('services.auth');
    const url = `${baseUrl}${path}`;
    const headers: Record<string, string> = {};

    if (user) {
      headers['X-User-Id'] = user.id;
      headers['X-User-Roles'] = user.roles.join(',');
    }

    const response = await firstValueFrom(
      this.httpService.request<T>({
        method,
        url,
        data,
        headers,
      }),
    );

    return response.data;
  }
}
