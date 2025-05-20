import { Provider } from '@nestjs/common';
import { EventType } from './constants/event-type.constant';
import { RewardType } from './constants/reward-type.constant';
import { DailyCheckInStrategy } from './strategies/conditions/daily-check-in.strategy';
import { WeeklyAttendanceStrategy } from './strategies/conditions/weekly-attendance.strategy';
import { ReferralStrategy } from './strategies/conditions/referral.strategy';
import { SpendThresholdStrategy } from './strategies/conditions/spend-threshold.strategy';
import { PaybackStrategy } from './strategies/conditions/payback.strategy';
import { FixedItemRewardStrategy } from './strategies/rewards/fixed-item-reward.strategy';
import { CashbackRewardStrategy } from './strategies/rewards/cashback-reward.strategy';
import { PointRewardStrategy } from './strategies/rewards/point-reward.strategy';

export const conditionStrategyProviders: Provider[] = [
  {
    provide: `ConditionStrategy.${EventType.DAILY_CHECK_IN}`,
    useClass: DailyCheckInStrategy,
  },
  {
    provide: `ConditionStrategy.${EventType.WEEKLY_ATTENDANCE}`,
    useClass: WeeklyAttendanceStrategy,
  },
  {
    provide: `ConditionStrategy.${EventType.REFERRAL}`,
    useClass: ReferralStrategy,
  },
  {
    provide: `ConditionStrategy.${EventType.SPEND_THRESHOLD}`,
    useClass: SpendThresholdStrategy,
  },
  {
    provide: `ConditionStrategy.${EventType.PAYBACK}`,
    useClass: PaybackStrategy,
  },
];

export const rewardStrategyProviders: Provider[] = [
  {
    provide: `RewardStrategy.${RewardType.ITEM}`,
    useClass: FixedItemRewardStrategy,
  },
  {
    provide: `RewardStrategy.${RewardType.CASHBACK}`,
    useClass: CashbackRewardStrategy,
  },
  {
    provide: `RewardStrategy.${RewardType.POINT}`,
    useClass: PointRewardStrategy,
  },
];

export const eventProviders: Provider[] = [
  ...conditionStrategyProviders,
  ...rewardStrategyProviders,
];