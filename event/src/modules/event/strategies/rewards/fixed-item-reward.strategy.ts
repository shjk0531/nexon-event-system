import { Injectable } from '@nestjs/common';
import { RewardStrategy } from './reward.strategy';
import { EventDocument } from '../../schemas/event.schema';
import { RewardDocument } from '../../schemas/reward.schema';
import { InventoryService } from '../../services/inventory.service';
import { ItemRewardDetailDto } from '../../dtos/reward-detail.dto';
import { RewardType } from '../../constants/reward-type.constant';

@Injectable()
export class FixedItemRewardStrategy implements RewardStrategy {
  constructor(
    private readonly inventoryService: InventoryService,
  ) {}

  async process(
    userId: string,
    event: EventDocument,
    reward: RewardDocument,
  ): Promise<ItemRewardDetailDto> {
    const { itemId, itemName, quantity } = reward.config as {
      itemId: string;
      itemName: string;
      quantity: number;
    };

    // 실제 아이템 지급
    await this.inventoryService.addItem(userId, itemId, quantity);

    // 반환할 보상 상세 DTO
    return {
      type: RewardType.ITEM,
      itemId,
      itemName,
      quantity,
    };
  }
}
