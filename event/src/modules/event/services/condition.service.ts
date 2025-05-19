import { Injectable, NotFoundException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ConditionStrategy } from '../strategies/conditions/condition.strategy';
import { EventDocument } from '../schemas/event.schema';

@Injectable()
export class ConditionService {
  constructor(private readonly moduleRef: ModuleRef) {}

  /**
   * event.type에 매핑된 ConditionStrategy를 찾아 실행합니다.
   */
  async canTrigger(userId: string, event: EventDocument): Promise<boolean> {
    const token = `ConditionStrategy.${event.type}`;
    const strategy = this.moduleRef.get<ConditionStrategy>(token, { strict: false });
    if (!strategy) {
      throw new NotFoundException(`No condition strategy for event type ${event.type}`);
    }
    return strategy.canTrigger(userId, event);
  }
}
