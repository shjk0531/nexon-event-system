import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RewardStrategy } from './reward.strategy';
import { EventDocument } from '../../schemas/event.schema';
import { RewardDocument } from '../../schemas/reward.schema';
import { ClaimDocument } from '../../schemas/claim.schema';
import { PaymentService } from '../../services/payment.service';
import { ClaimStatus } from '../../constants/claim-status.constant';
import { CashbackRewardDetailDto } from '../../dtos/reward-detail.dto';
import { RewardType } from '../../constants/reward-type.constant';
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
  ): Promise<CashbackRewardDetailDto> {
    const { rate, maxAmount } = reward.config as {
      rate: number;
      maxAmount: number;
    };

    const lastPayment = await this.paymentService.getLastPayment(userId);
    if (!lastPayment) {
      throw new Error('No payment found for cashback');
    }

     // 마지막 결제 금액 조회
     const last = await this.paymentService.getLastPayment(userId);
     const amountPaid = last?.amount ?? 0;
 
     // 캐시백 계산
     const cashback = Math.min(amountPaid * rate, maxAmount);
 
     // 실제 캐시백 트랜잭션 생성
     await this.paymentService.issueCashback(userId, cashback);
 
     return {
       type: RewardType.CASHBACK,
       rate,
       amount: cashback,
     };
  }
}