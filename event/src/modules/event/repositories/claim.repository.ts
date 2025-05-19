import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Claim, ClaimDocument } from '../schemas/claim.schema';
import { ClaimStatus } from '../constants/claim-status.constant';

@Injectable()
export class ClaimRepository {
  constructor(
    @InjectModel(Claim.name) private readonly model: Model<ClaimDocument>,
  ) {}

  async create(
    userId: string,
    eventId: string,
  ): Promise<ClaimDocument> {
    return this.model.create({
      userId: new Types.ObjectId(userId),
      eventId: new Types.ObjectId(eventId),
      status: ClaimStatus.PENDING,
      requestedAt: new Date(),
    });
  }

  async findOneByUserAndEvent(
    userId: string,
    eventId: string,
  ): Promise<ClaimDocument | null> {
    return this.model
      .findOne({
        userId: new Types.ObjectId(userId),
        eventId: new Types.ObjectId(eventId),
      })
      .exec();
  }

  async findByUserEventInPeriod(
    userId: string,
    eventId: string,
    start: Date,
    end: Date,
  ): Promise<ClaimDocument[]> {
    return this.model
      .find({
        userId: new Types.ObjectId(userId),
        eventId: new Types.ObjectId(eventId),
        requestedAt: { $gte: start, $lte: end },
      })
      .exec();
  }

  async countByUserEventInPeriod(
    userId: string,
    eventId: string,
    start: Date,
    end: Date,
  ): Promise<number> {
    return this.model
      .countDocuments({
        userId: new Types.ObjectId(userId),
        eventId: new Types.ObjectId(eventId),
        requestedAt: { $gte: start, $lte: end },
      })
      .exec();
  }

  async findAll(filter: {
    eventId?: string;
    status?: ClaimStatus[];
  }): Promise<ClaimDocument[]> {
    const query: any = {};
    if (filter.eventId) query.eventId = new Types.ObjectId(filter.eventId);
    if (filter.status) query.status = { $in: filter.status };
    return this.model.find(query).exec();
  }

  async updateStatus(
    id: string,
    status: ClaimStatus,
    detail?: Record<string, any>,
  ): Promise<ClaimDocument> {
    const updated = await this.model
      .findByIdAndUpdate(
        id,
        { status, processedAt: new Date(), detail },
        { new: true },
      )
      .exec();
    if (!updated) throw new NotFoundException(`Claim ${id} not found`);
    return updated;
  }
}