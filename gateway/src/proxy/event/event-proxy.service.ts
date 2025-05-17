import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EventProxyService {
  private readonly baseUrl: string;
  constructor(
    private readonly httpService: HttpService,
    configService: ConfigService,
  ) {
    this.baseUrl = configService.getOrThrow<string>('services.event');
  }

  async requestReward(userId: string, eventId: string) {
    const response = await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/events/${eventId}/rewards`, {
        userId,
      }),
    );

    return response.data;
  }
}
