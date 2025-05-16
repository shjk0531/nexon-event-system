import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthProxyService } from './auth-proxy.service';
import { EventProxyService } from './event-proxy.service';
import { ProxyRequestService } from './proxy-request.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [AuthProxyService, EventProxyService, ProxyRequestService],
  exports: [AuthProxyService, EventProxyService, ProxyRequestService],
})
export class ProxyModule {}
