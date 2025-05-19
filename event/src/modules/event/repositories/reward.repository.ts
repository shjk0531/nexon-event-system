import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reward, RewardDocument } from '../schemas/reward.schema';
import { CreateRewardDto } from '../dtos/create-reward.dto';

@Injectable()
export class RewardRepository {
  constructor(
    @InjectModel(Reward.name) private readonly model: Model<RewardDocument>,
  ) {}

  async create(
    eventId: string,
    data: CreateRewardDto,
  ): Promise<RewardDocument> {
    return this.model.create({ eventId: new Types.ObjectId(eventId), ...data });
  }

  async findByEventId(eventId: string): Promise<RewardDocument[]> {
    return this.model
      .find({ eventId: new Types.ObjectId(eventId) })
      .exec();
  }

  async findAll(): Promise<RewardDocument[]> {
    return this.model.find().exec();
  }

  async deleteByEventId(eventId: string): Promise<void> {
    await this.model
      .deleteMany({ eventId: new Types.ObjectId(eventId) })
      .exec();
  }
}