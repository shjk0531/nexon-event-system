import { Injectable, NotFoundException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ConditionStrategy } from '../strategies/conditions/condition.strategy';
import { EventDocument } from '../schemas/event.schema';

@Injectable()
export class ConditionService {
  constructor(private readonly moduleRef: ModuleRef) {}

  /**
   * event.type에 매핑된 ConditionStrategy를 찾아 실행
   */
  async canTrigger(
    userId: string, 
    event: EventDocument,
    payload?: Record<string, any>
  ): Promise<boolean> {
    const token = `ConditionStrategy.${event.type}`;
    const strategy = this.moduleRef.get<ConditionStrategy>(token, { strict: false });
    if (!strategy) {
      throw new NotFoundException(`No condition strategy for event type ${event.type}`);
    }

    // userId가 객체로 전달될 가능성을 고려하여 .id 사용
    const userIdString = typeof userId === 'string' ? userId : (userId as any).id;
    // 디버깅용 로그: 어떤 조건 전략이 호출되었고 결과가 무엇인지 출력
    const allowed = await strategy.canTrigger(userIdString, event, payload);
    console.log(
      `[ConditionService] userId=${userIdString} eventId=${event._id.toString()} type=${event.type} allowed=${allowed}`,
    );

    return allowed;
  }
}
