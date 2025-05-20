import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProxyService } from './proxy.service';
@Global()
@Module({
  imports: [HttpModule],
  providers: [ProxyService],
  exports: [ProxyService],
})
export class ProxyModule {}
