import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RewardStrategy } from './reward.strategy';
import { EventDocument } from '../../schemas/event.schema';
import { RewardDocument } from '../../schemas/reward.schema';
import { ClaimDocument } from '../../schemas/claim.schema';
import { InventoryService } from '../../services/inventory.service';
import { ClaimStatus } from '../../constants/claim-status.constant';

@Injectable()
export class FixedItemRewardStrategy implements RewardStrategy {
  constructor(
    @InjectModel('Claim')
    private readonly claimModel: Model<ClaimDocument>,
    private readonly inventoryService: InventoryService,
  ) {}

  async process(
    userId: string,
    event: EventDocument,
    reward: RewardDocument,
    payload?: Record<string, any>
  ): Promise<void> {
    const { itemId, quantity } = reward.config as {
      itemId: string;
      quantity: number;
    };

    // 아이템 지급
    await this.inventoryService.addItem(userId, itemId, quantity);

    // 클레임 상태 업데이트
    await this.claimModel
      .findOneAndUpdate(
        { userId, eventId: event._id },
        {
          status: ClaimStatus.GRANTED,
          processedAt: new Date(),
          detail: { itemId, quantity },
        },
        { new: true },
      )
      .exec();
  }
}