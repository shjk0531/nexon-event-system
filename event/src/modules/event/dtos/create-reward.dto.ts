import { IsEnum, IsObject } from 'class-validator';
import { RewardType } from '../constants/reward-type.constant';

export class CreateRewardDto {
  @IsEnum(RewardType)
  type: RewardType;

  @IsObject()
  config: Record<string, any>;
}
