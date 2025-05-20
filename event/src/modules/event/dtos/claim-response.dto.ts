import { ClaimStatus } from '../constants/claim-status.constant';
import { RewardDetailDto } from './reward-detail.dto';

export class ClaimResponseDto {
  claimId: string;
  status: ClaimStatus;           // PENDING, GRANTED, REJECTED
  rewards?: RewardDetailDto[];   // status=GRANTED 일 때만 존재
  processedAt?: string;          // ISO8601
}
