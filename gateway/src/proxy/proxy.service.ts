// proxy.service.ts
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { catchError, lastValueFrom } from 'rxjs';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  /**
   * @param service 'auth' | 'event'
   * @param req
   * @param res
   */
  async forward(
    service: 'auth' | 'event',
    req: Request & { cookies?: Record<string, string>; user?: any; isPublic?: boolean },
    res: Response,
  ): Promise<AxiosResponse<any>> {

    const base = this.config.get<string>(
      service === 'auth' ? 'services.auth' : 'services.event',
    );
    const raw = (req.path ?? req.url).toString();
    const cleanPath = raw.split('?')[0];
    const path = cleanPath.replace(/^\/api\/(auth|event)/, '');
    const url  = base + path;

    const { host, 'content-length': _cl, ...forwardHeaders } = req.headers as any;
    const headers: Record<string, string> = { ...forwardHeaders };

    if (!req.isPublic && req.user) {
      headers['x-user-id']   = req.user.id;
      headers['x-user-role'] = req.user.role;
    }

    if (req.cookies) {
      const cookieHeader = Object.entries(req.cookies)
        .map(([key, val]) => `${key}=${val}`)
        .join('; ');
      headers['cookie'] = cookieHeader;
    }

    const axiosConfig: AxiosRequestConfig = {
      method:  req.method as any,
      url,
      headers,
      params:       req.query,
      data:         req.body,
      responseType: 'json',
      withCredentials: true,
    };

    this.logger.log('Proxying to upstream', axiosConfig);

    const upstreamRes = await lastValueFrom(
      this.http.request(axiosConfig).pipe(
        catchError(err => {
          const status = err.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
          const data   = err.response?.data   ?? { message: 'Upstream error' };
          this.logger.error(`Upstream ${url} failed: ${status} ${JSON.stringify(data)}`);
          throw new HttpException(data, status);
        }),
      ),
    );

    const setCookie = upstreamRes.headers['set-cookie'];
    if (setCookie) {
      res.setHeader('Set-Cookie', setCookie as string[]);
    }

    return upstreamRes;
  }
}
