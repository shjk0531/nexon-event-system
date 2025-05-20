import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConditionStrategy } from './condition.strategy';
import { ClaimDocument } from '../../schemas/claim.schema';
import { EventDocument } from '../../schemas/event.schema';

@Injectable()
export class WeeklyAttendanceStrategy implements ConditionStrategy {
  constructor(
    @InjectModel('Claim') private readonly claimModel: Model<ClaimDocument>,
  ) {}

  async canTrigger(userId: string, event: EventDocument): Promise<boolean> {
    const now = new Date();
    if (!event.isActive || now < event.startAt || now > event.endAt) {
      return false;
    }

    const day = now.getDay();
    const diff = day === 0 ? 6 : day - 1;
    const startOfWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - diff,
    );
    const endOfWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000 - 1);

    const count = await this.claimModel.countDocuments({
      userId: new Types.ObjectId(userId),
      eventId: event._id,
      requestedAt: { $gte: startOfWeek, $lte: endOfWeek },
    }).exec();

    const minCount = event.config.minCount as number;
    if (typeof minCount !== 'number') {
      return false;
    }

    return count >= (minCount - 1);
  }
}
