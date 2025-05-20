// src/modules/event/services/claim.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClaimDocument } from '../schemas/claim.schema';
import { EventDocument } from '../schemas/event.schema';
import { ClaimStatus } from '../constants/claim-status.constant';
import { ConditionService } from './condition.service';
import { RewardService } from './reward.service';
import { ClaimResponseDto } from '../dtos/claim-response.dto';
import { RewardDetailDto } from '../dtos/reward-detail.dto';

@Injectable()
export class ClaimService {
  constructor(
    @InjectModel('Claim') private readonly claimModel: Model<ClaimDocument>,
    @InjectModel('Event') private readonly eventModel: Model<EventDocument>,
    private readonly conditionService: ConditionService,
    private readonly rewardService: RewardService,
  ) {}

  /**
   * 사용자의 보상 요청 생성 및 처리
   */
  async create(
    userId: string,
    eventId: string,
    payload?: Record<string, any>,
  ): Promise<ClaimResponseDto> {
    // 1) 이벤트 존재 확인
    const event = await this.eventModel.findById(eventId).exec();
    if (!event) {
      throw new NotFoundException(`Event ${eventId} not found`);
    }

    // 2) PENDING 상태로 클레임 생성
    const created = await this.claimModel.create({
      eventId: event._id,
      userId,
      status: ClaimStatus.PENDING,
      requestedAt: new Date(),
    });

    const claimId = (created._id as any).toString();
    const now = new Date();

    // 3) 조건 검증
    const allowed = await this.conditionService.canTrigger(userId, event, payload);

    if (allowed) {
      // 4a) 보상 처리
      const rewards: RewardDetailDto[] = await this.rewardService.processRewards(
        userId,
        event,
        payload,
      );
      // 5a) 상태 업데이트
      await this.claimModel
        .findByIdAndUpdate(
          created._id,
          {
            status: ClaimStatus.GRANTED,
            processedAt: now,
            detail: rewards,
          },
          { new: true },
        )
        .exec();

      return {
        claimId,
        status: ClaimStatus.GRANTED,
        processedAt: now.toISOString(),
        rewards,
      };
    } else {
      // 4b) 거부 처리
      await this.claimModel
        .findByIdAndUpdate(
          created._id,
          {
            status: ClaimStatus.REJECTED,
            processedAt: now,
          },
          { new: true },
        )
        .exec();

      return {
        claimId,
        status: ClaimStatus.REJECTED,
        processedAt: now.toISOString(),
      };
    }
  }

  /**
   * 특정 유저의 특정 이벤트 보상 요청 조회
   */
  async findOneByUserAndEvent(
    userId: string,
    eventId: string,
  ): Promise<ClaimResponseDto> {
    const claim = await this.claimModel.findOne({ userId, eventId }).exec();
    if (!claim) {
      throw new NotFoundException(`Claim for event ${eventId} not found`);
    }
    return this.toResponseDto(claim);
  }

  /**
   * 운영자/감사자: 전체 클레임 조회 (필터링 가능)
   */
  async findAll(filter: {
    eventId?: string;
    status?: ClaimStatus[];
  }): Promise<ClaimResponseDto[]> {
    const query: any = {};
    if (filter.eventId) query.eventId = filter.eventId;
    if (filter.status) query.status = { $in: filter.status };

    const docs = await this.claimModel.find(query).exec();
    return docs.map((c) => this.toResponseDto(c));
  }

  /**
   * ClaimDocument -> ClaimResponseDto 변환 헬퍼
   */
  private toResponseDto(doc: ClaimDocument): ClaimResponseDto {
    const dto: ClaimResponseDto = {
      claimId: (doc._id as any).toString(),
      status: doc.status,
      processedAt: doc.processedAt?.toISOString(),
    };
    if (doc.status === ClaimStatus.GRANTED && Array.isArray(doc.detail)) {
      dto.rewards = doc.detail as RewardDetailDto[];
    }
    return dto;
  }
}
