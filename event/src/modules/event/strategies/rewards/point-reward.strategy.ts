import { Injectable, Logger } from '@nestjs/common';
import { RewardStrategy } from './reward.strategy';
import { EventDocument } from '../../schemas/event.schema';
import { RewardDocument } from '../../schemas/reward.schema';
import { ClaimStatus } from '../../constants/claim-status.constant';
import { InjectModel } from '@nestjs/mongoose';
import { Claim, ClaimDocument } from '../../schemas/claim.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class PointRewardStrategy implements RewardStrategy {
  private readonly logger = new Logger(PointRewardStrategy.name);

  constructor(
    @InjectModel(Claim.name) private readonly claimModel: Model<ClaimDocument>,
    // TODO: 실제 포인트 지급을 위한 서비스 주입 (e.g., UserService, PointService)
  ) {}

  async process(
    userId: string,
    event: EventDocument,
    reward: RewardDocument,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    payload?: Record<string, any>,
  ): Promise<void> {
    const { amount, target = 'user' } = reward.config as {
      amount: number;
      target?: 'user' | 'referrer';
    };
    const rewardIdString = (reward._id as Types.ObjectId).toString();

    this.logger.log(
      `Attempting to process POINT reward for userId: ${userId}, eventId: ${event._id.toString()}, rewardId: ${rewardIdString}, amount: ${amount}, target: ${target}`,
    );

    // TODO: 실제 포인트 지급 로직 구현
    // 예시: await this.pointService.addPoints(userId, amount);
    // 현재는 지급 성공으로 간주하고 클레임 상태만 업데이트합니다.
    this.logger.warn(
      `POINT reward logic not fully implemented. Simulating success for userId: ${userId}, amount: ${amount}`,
    );

    // 클레임 상태 업데이트 (성공 간주)
    try {
      await this.claimModel
        .findOneAndUpdate(
          { userId, eventId: event._id /*, status: ClaimStatus.PENDING */ }, // status PENDING 조건은 상황에 따라 필요 없을 수 있음
          {
            status: ClaimStatus.GRANTED,
            processedAt: new Date(),
            $push: { 
              detail: { 
                rewardType: reward.type,
                rewardId: reward._id,
                status: ClaimStatus.GRANTED,
                message: `Point ${amount} granted to ${target}`,
                amount,
                target,
              }
            }
          },
          { new: true },
        )
        .exec();
      this.logger.log(`Claim status updated to GRANTED for userId: ${userId}, eventId: ${event._id.toString()}`);
    } catch (error) {
      this.logger.error(`Failed to update claim status for userId: ${userId}, eventId: ${event._id.toString()}`, error);
      // 오류 발생 시에도 계속 진행할지, 아니면 예외를 던질지 결정 필요
    }
  }
} 