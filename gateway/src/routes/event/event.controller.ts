import { Controller, Post } from "@nestjs/common";
import { Get } from "@nestjs/common";
import { EventProxyService } from "proxy/event/event-proxy.service";
import { Public } from "common/decorators/public.decorator";

@Controller('event')
export class EventController {
  constructor(private readonly eventProxyService: EventProxyService) {}

  @Public()
  @Get('test')
  async test() {
    return this.eventProxyService.test();
  }

}
