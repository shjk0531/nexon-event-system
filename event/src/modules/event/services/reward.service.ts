import { Injectable, NotFoundException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RewardDocument } from '../schemas/reward.schema';
import { EventDocument } from '../schemas/event.schema';
import { RewardStrategy } from '../strategies/rewards/reward.strategy';

@Injectable()
export class RewardService {
  constructor(
    @InjectModel('Reward') private readonly rewardModel: Model<RewardDocument>,
    private readonly moduleRef: ModuleRef,
  ) {}

  /**
   * eventId에 연결된 모든 Reward를 조회한 뒤, 각 보상 타입에 맞는
   * RewardStrategy.process를 실행합니다.
   */
  async processRewards(userId: string, event: EventDocument): Promise<void> {
    const rewards = await this.rewardModel.find({ eventId: event._id }).exec();
    if (!rewards.length) {
      return;
    }

    for (const reward of rewards) {
      const token = `RewardStrategy.${reward.type}`;
      const strategy = this.moduleRef.get<RewardStrategy>(token, { strict: false });
      if (!strategy) {
        throw new NotFoundException(`No reward strategy for type ${reward.type}`);
      }
      await strategy.process(userId, event, reward);
    }
  }
}
