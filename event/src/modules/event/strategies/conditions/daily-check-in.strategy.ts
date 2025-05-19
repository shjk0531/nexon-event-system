import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConditionStrategy } from './condition.strategy';
import { ClaimDocument } from '../../schemas/claim.schema';
import { EventDocument } from '../../schemas/event.schema';

@Injectable()
export class DailyCheckInStrategy implements ConditionStrategy {
  constructor(
    @InjectModel('Claim') private readonly claimModel: Model<ClaimDocument>,
  ) {}

  async canTrigger(userId: string, event: EventDocument): Promise<boolean> {
    const now = new Date();
    // 이벤트 활성 및 기간 확인
    if (!event.isActive || now < event.startAt || now > event.endAt) {
      return false;
    }

    // 오늘 00:00:00 ~ 23:59:59 범위 계산
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1);

    // 오늘 이미 출석(클레임) 했는지 확인
    const count = await this.claimModel.countDocuments({
      userId,
      eventId: event._id,
      requestedAt: { $gte: startOfDay, $lte: endOfDay },
    }).exec();

    return count === 0;
  }
}
