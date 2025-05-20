import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConditionStrategy } from './condition.strategy';
import { ClaimDocument } from '../../schemas/claim.schema';
import { EventDocument } from '../../schemas/event.schema';
import { PaymentService } from '../../services/payment.service';

@Injectable()
export class PaybackStrategy implements ConditionStrategy {
  constructor(
    @InjectModel('Claim') private readonly claimModel: Model<ClaimDocument>,
    private readonly paymentService: PaymentService,
  ) {}

  async canTrigger(userId: string, event: EventDocument): Promise<boolean> {
    const now = new Date();
    if (!event.isActive || now < event.startAt || now > event.endAt) {
      return false;
    }

    // 마지막 클레임 이후 결제가 있었는지 확인
    const lastClaim = await this.claimModel
      .findOne({ userId, eventId: event._id })
      .sort({ requestedAt: -1 })
      .exec();
    const since = lastClaim?.requestedAt ?? event.startAt;

    // 결제 기록이 있으면 payback 처리 가능
    return this.paymentService.hasPaymentSince(userId, since);
  }
}
