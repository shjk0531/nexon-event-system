import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RewardDocument } from '../schemas/reward.schema';
import { EventDocument } from '../schemas/event.schema';
import { RewardStrategy } from '../strategies/rewards/reward.strategy';

@Injectable()
export class RewardService {
  private readonly logger = new Logger(RewardService.name);

  constructor(
    @InjectModel('Reward') private readonly rewardModel: Model<RewardDocument>,
    private readonly moduleRef: ModuleRef,
  ) {}

  /**
   * eventId에 연결된 모든 Reward를 조회
   * 보상 타입에 맞는 RewardStrategy.process 실행
   */
  async processRewards(
    userIdInput: string | { id: string },
    event: EventDocument,
    payload?: Record<string, any>
  ): Promise<void> {
    const userId = typeof userIdInput === 'string' ? userIdInput : userIdInput.id;
    this.logger.log(`Processing rewards for userId (string): ${userId}, eventId: ${event._id.toString()}`);

    const rewards = await this.rewardModel.find({ eventId: event._id }).exec();
    if (!rewards.length) {
      this.logger.log(`No rewards found for eventId: ${event._id.toString()}`);
      return;
    }

    for (const reward of rewards) {
      const token = `RewardStrategy.${reward.type}`;
      let strategy: RewardStrategy | undefined;
      try {
        strategy = this.moduleRef.get<RewardStrategy>(token, { strict: false });
      } catch (error) {
        this.logger.warn(`Error while trying to get strategy for token ${token}: ${error.message}`);
      }

      if (!strategy) {
        this.logger.warn(
          `No reward strategy found for type ${reward.type}. Skipping this reward. (eventId: ${event._id.toString()}, rewardId: ${(reward._id as any).toString()})`,
        );
        continue;
      }

      try {
        await strategy.process(userId, event, reward, payload);
      } catch (error) {
        this.logger.error(
          `Error processing reward type ${reward.type} for userId ${userId}, eventId: ${event._id.toString()}, rewardId: ${(reward._id as any).toString()}: ${error.message}`,
          error.stack,
        );
      }
    }
  }
}
