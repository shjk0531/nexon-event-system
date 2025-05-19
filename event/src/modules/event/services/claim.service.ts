import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClaimDocument } from '../schemas/claim.schema';
import { EventDocument } from '../schemas/event.schema';
import { ClaimStatus } from '../constants/claim-status.constant';
import { ConditionService } from './condition.service';
import { RewardService } from './reward.service';

@Injectable()
export class ClaimService {
  constructor(
    @InjectModel('Claim') private readonly claimModel: Model<ClaimDocument>,
    @InjectModel('Event') private readonly eventModel: Model<EventDocument>,
    private readonly conditionService: ConditionService,
    private readonly rewardService: RewardService,
  ) {}

  /**
   * 사용자의 보상 요청을 생성하고, 조건검증 → 보상처리(또는 거부) 순으로 진행합니다.
   */
  async create(userId: string, eventId: string): Promise<ClaimDocument> {
    const event = await this.eventModel.findById(eventId).exec();
    if (!event) throw new NotFoundException(`Event ${eventId} not found`);

    const claim = await this.claimModel.create({
      eventId: event._id,
      userId,
      status: ClaimStatus.PENDING,
      requestedAt: new Date(),
    });

    const allowed = await this.conditionService.canTrigger(userId, event);
    if (allowed) {
      await this.rewardService.processRewards(userId, event);
    } else {
      await this.claimModel.findByIdAndUpdate(claim._id, {
        status: ClaimStatus.REJECTED,
        processedAt: new Date(),
      });
    }

    return this.claimModel.findById(claim._id).exec() as Promise<ClaimDocument>;
  }

  /** 특정 유저·이벤트 조합의 클레임 조회 */
  async findOneByUserAndEvent(
    userId: string,
    eventId: string,
  ): Promise<ClaimDocument> {
    return this.claimModel.findOne({ userId, eventId }).exec() as Promise<ClaimDocument>;
  }

  /** 운영자/감사자용: 전체 클레임 조회 (필터링 가능) */
  async findAll(filter: {
    eventId?: string;
    status?: ClaimStatus[];
  }): Promise<ClaimDocument[]> {
    const query: any = {};
    if (filter.eventId) query.eventId = filter.eventId;
    if (filter.status) query.status = { $in: filter.status };
    return this.claimModel.find(query).exec();
  }
}
