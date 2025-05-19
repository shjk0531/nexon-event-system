import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthUserProxyService } from './auth/auth-user-proxy.service';
import { AuthAuthProxyService } from './auth/auth-auth-proxy.service';
import { EventProxyService } from './event/event-proxy.service';
import { ProxyRequestService } from './proxy-request.service';
import { ProxyService } from './proxy.service';
@Global()
@Module({
  imports: [HttpModule],
  providers: [AuthUserProxyService, AuthAuthProxyService, EventProxyService, ProxyRequestService, ProxyService],
  exports: [AuthUserProxyService, AuthAuthProxyService, EventProxyService, ProxyRequestService, ProxyService],
})
export class ProxyModule {}
