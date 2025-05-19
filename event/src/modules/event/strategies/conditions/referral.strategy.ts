import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConditionStrategy } from './condition.strategy';
import { ClaimDocument } from '../../schemas/claim.schema';
import { EventDocument } from '../../schemas/event.schema';

@Injectable()
export class ReferralStrategy implements ConditionStrategy {
  constructor(
    @InjectModel('Claim') private readonly claimModel: Model<ClaimDocument>,
  ) {}

  async canTrigger(userId: string, event: EventDocument): Promise<boolean> {
    const now = new Date();
    if (!event.isActive || now < event.startAt || now > event.endAt) {
      return false;
    }

    // 이전에 한 번도 추천 클레임을 하지 않았어야 함
    const existing = await this.claimModel
      .findOne({ userId, eventId: event._id })
      .exec();
    return !existing;
  }
}
