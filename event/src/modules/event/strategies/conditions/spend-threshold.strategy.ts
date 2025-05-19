import { Injectable } from '@nestjs/common';
import { ConditionStrategy } from './condition.strategy';
import { EventDocument } from '../../schemas/event.schema';
import { PaymentService } from '../../services/payment.service';

@Injectable()
export class SpendThresholdStrategy implements ConditionStrategy {
  constructor(private readonly paymentService: PaymentService) {}

  async canTrigger(userId: string, event: EventDocument): Promise<boolean> {
    const now = new Date();
    if (!event.isActive || now < event.startAt || now > event.endAt) {
      return false;
    }

    const threshold = event.config.threshold as number;
    if (typeof threshold !== 'number') {
      return false;
    }

    // 해당 기간 내 유저의 결제 합산 금액 조회
    const totalSpent = await this.paymentService.getTotalSpent(
      userId,
      event.startAt,
      event.endAt,
    );
    return totalSpent >= threshold;
  }
}
