import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConditionStrategy } from './condition.strategy';
import { ClaimDocument } from '../../schemas/claim.schema';
import { EventDocument } from '../../schemas/event.schema';
import { ReferralCodeService } from '../../services/referral-code.service';
@Injectable()
export class ReferralStrategy implements ConditionStrategy {
  constructor(
    @InjectModel('Claim') private readonly claimModel: Model<ClaimDocument>,
    private readonly referralCodeService: ReferralCodeService,
  ) {}

  async canTrigger(
    userId: string, 
    event: EventDocument, 
    payload: Record<string, any>
  ): Promise<boolean> {
    const code = payload.referralCode;
    console.log('[ReferralStrategy] payload=', payload);
    if (!code) {
      throw new BadRequestException('Referral code is required');
    }

    // 추천인 코드 디코드 -> referrerId
    const referrerId = this.referralCodeService.decode(code);
    console.log('[ReferralStrategy] userId=', userId, 'referrerId=', referrerId);

    if (referrerId === userId) {
      throw new BadRequestException('Referral code cannot be used by the same user');
    }

    const now = new Date();
    const withinPeriod = event.isActive && (now >= event.startAt) && (now <= event.endAt);
    console.log('[ReferralStrategy] now=', now.toISOString(), 'event.startAt=', event.startAt, 'event.endAt=', event.endAt, 'isActive=', event.isActive, 'withinPeriod=', withinPeriod);

    if (!withinPeriod) {
      return false;
    }

    // 이전에 한 번도 추천 클레임을 하지 않았어야 함
    const existing = await this.claimModel
      .findOne({ userId, eventId: event._id })
      .exec();
    console.log('[ReferralStrategy] existingClaim=', existing?._id ?? null);

    return !existing;
  }
}
