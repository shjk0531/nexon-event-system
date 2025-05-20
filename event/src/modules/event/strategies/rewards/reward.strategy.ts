import { EventDocument } from '../../schemas/event.schema';
import { RewardDocument } from '../../schemas/reward.schema';
import { RewardDetailDto } from '../../dtos/reward-detail.dto';

export interface RewardStrategy {
  process(
    userId: string,
    event: EventDocument,
    reward: RewardDocument,
    payload?: Record<string, any>
  ): Promise<RewardDetailDto>;
}