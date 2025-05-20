import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventDocument } from '../schemas/event.schema';
import { RewardDocument } from '../schemas/reward.schema';
import { ClaimDocument } from '../schemas/claim.schema';
import { CreateEventDto } from '../dtos/create-event.dto';
import { UpdateEventDto } from '../dtos/update-event.dto';
import { CreateRewardDto } from '../dtos/create-reward.dto';
import { EventType } from '../constants/event-type.constant';
import { ReferralCodeService } from './referral-code.service';
@Injectable()
export class EventService {
  constructor(
    @InjectModel('Event') private readonly eventModel: Model<EventDocument>,
    @InjectModel('Reward') private readonly rewardModel: Model<RewardDocument>,
    @InjectModel('Claim') private readonly claimModel: Model<ClaimDocument>,
    private readonly referralCodeService: ReferralCodeService,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<EventDocument> {
    return this.eventModel.create(createEventDto);
  }

  async findAll(): Promise<EventDocument[]> {
    return this.eventModel.find().exec();
  }

  async findOne(id: string): Promise<EventDocument> {
    const event = await this.eventModel.findById(id).exec();
    if (!event) throw new NotFoundException(`Event ${id} not found`);
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<EventDocument> {
    const event = await this.eventModel
      .findByIdAndUpdate(id, updateEventDto, { new: true })
      .exec();
    console.log(event);
    if (!event) throw new NotFoundException(`Event ${id} not found`);
    return event;
  }

  async remove(id: string): Promise<void> {
    const res = await this.eventModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException(`Event ${id} not found`);
  }

  async addReward(eventId: string, createRewardDto: CreateRewardDto): Promise<RewardDocument> {
    const event = await this.eventModel.findById(eventId).exec();
    if (!event) throw new NotFoundException(`Event ${eventId} not found`);
    return this.rewardModel.create({ eventId: event._id, ...createRewardDto });
  }

  async getCalendar(
    userId: string,
    month: string, // format: 'YYYY-MM'
  ): Promise<{ days: { date: string; claimed: boolean }[] }> {
    const [yearStr, monthStr] = month.split('-');
    const year = parseInt(yearStr, 10);
    const monthIndex = parseInt(monthStr, 10) - 1;

    const startDate = new Date(year, monthIndex, 1);
    const endDate = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);
    const daysInMonth = endDate.getDate();

    // find active daily-check-in event overlapping this month
    const events = await this.eventModel
      .find({
        type: EventType.DAILY_CHECK_IN,
        isActive: true,
        startAt: { $lte: endDate },
        endAt: { $gte: startDate },
      })
      .exec();

    // if no event, return empty calendar
    if (!events.length) {
      return {
        days: Array.from({ length: daysInMonth }, (_, i) => ({
          date: new Date(year, monthIndex, i + 1)
            .toISOString()
            .split('T')[0],
          claimed: false,
        })),
      };
    }

    const event = events[0];
    const claims = await this.claimModel
      .find({
        userId,
        eventId: event._id,
        requestedAt: { $gte: startDate, $lte: endDate },
      })
      .exec();

    const claimedDates = new Set(
      claims.map((c) => c.requestedAt.toISOString().split('T')[0]),
    );

    return {
      days: Array.from({ length: daysInMonth }, (_, i) => {
        const dateStr = new Date(year, monthIndex, i + 1)
          .toISOString()
          .split('T')[0];
        return { date: dateStr, claimed: claimedDates.has(dateStr) };
      }),
    };
  }

  async getReferrerId(userId: string): Promise<string> {
    const refferrerId = this.referralCodeService.generate(userId);
    return refferrerId;
  }
}
