import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RewardStrategy } from './reward.strategy';
import { EventDocument } from '../../schemas/event.schema';
import { RewardDocument } from '../../schemas/reward.schema';
import { ClaimDocument } from '../../schemas/claim.schema';
import { PaymentService } from '../../services/payment.service';
import { ClaimStatus } from '../../constants/claim-status.constant';

/**
 * 확률 기반 캐시백 지급 전략
 */
@Injectable()
export class CashbackRewardStrategy implements RewardStrategy {
  constructor(
    @InjectModel('Claim')
    private readonly claimModel: Model<ClaimDocument>,
    private readonly paymentService: PaymentService,
  ) {}

  async process(
    userId: string,
    event: EventDocument,
    reward: RewardDocument,
  ): Promise<void> {
    const { rate, maxAmount } = reward.config as {
      rate: number;
      maxAmount: number;
    };

    const lastPayment = await this.paymentService.getLastPayment(userId);
    if (!lastPayment) {
      throw new Error('No payment found for cashback');
    }

    const cashback = Math.min(lastPayment.amount * rate, maxAmount);

    await this.paymentService.issueCashback(userId, cashback);

    await this.claimModel
      .findOneAndUpdate(
        { userId, eventId: event._id },
        {
          status: ClaimStatus.GRANTED,
          processedAt: new Date(),
          detail: { cashbackAmount: cashback },
        },
        { new: true },
      )
      .exec();
  }
}