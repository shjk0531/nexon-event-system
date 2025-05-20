import { RewardType } from '../constants/reward-type.constant';

/** 공통 인터페이스 */
export abstract class RewardDetailDto {
  type: RewardType;
}

/** 아이템 보상 */
export class ItemRewardDetailDto extends RewardDetailDto {
  declare type: RewardType.ITEM;
  itemId: string;
  itemName: string;
  quantity: number;
}

/** 포인트/게임머니 보상 */
export class PointRewardDetailDto extends RewardDetailDto {
  declare type: RewardType.POINT;
  amount: number;
  currency: 'GAME_MONEY' | 'CASH';
}

/** 쿠폰 보상 */
export class CouponRewardDetailDto extends RewardDetailDto {
  declare type: RewardType.COUPON;
  couponCode: string;
  discount: number;
  expiry: string; // ISO8601
}

/** 캐시백 보상 */
export class CashbackRewardDetailDto extends RewardDetailDto {
  declare type: RewardType.CASHBACK;
  rate: number;      // 예: 0.1 (10%)
  amount: number;    // 실제 지급된 금액
}
