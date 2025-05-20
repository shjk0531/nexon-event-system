import { Injectable, Logger } from '@nestjs/common';
import { RewardStrategy } from './reward.strategy';
import { EventDocument } from '../../schemas/event.schema';
import { RewardDocument } from '../../schemas/reward.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Claim, ClaimDocument } from '../../schemas/claim.schema';
import { Model, Types } from 'mongoose';
import { PointRewardDetailDto } from '../../dtos/reward-detail.dto';
import { RewardType } from '../../constants/reward-type.constant';

@Injectable()
export class PointRewardStrategy implements RewardStrategy {
  private readonly logger = new Logger(PointRewardStrategy.name);

  constructor(
    @InjectModel(Claim.name) private readonly claimModel: Model<ClaimDocument>,
  ) {}

  async process(
    userId: string,
    event: EventDocument,
    reward: RewardDocument,
    payload?: Record<string, any>,
  ): Promise<PointRewardDetailDto> {
    const { amount, target = 'user' } = reward.config as {
      amount: number;
      target?: 'user' | 'referrer';
    };
    const rewardIdString = (reward._id as Types.ObjectId).toString();

    return {
      type: RewardType.POINT,
      amount,
      currency: 'GAME_MONEY',
    };
    
  }
} 