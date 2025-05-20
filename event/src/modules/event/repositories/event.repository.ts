import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from '../schemas/event.schema';
import { CreateEventDto } from '../dtos/create-event.dto';
import { UpdateEventDto } from '../dtos/update-event.dto';
import { EventType } from '../constants/event-type.constant';

@Injectable()
export class EventRepository {
  constructor(
    @InjectModel(Event.name) private readonly model: Model<EventDocument>,
  ) {}

  async create(data: CreateEventDto): Promise<EventDocument> {
    return this.model.create(data);
  }

  async findAll(): Promise<EventDocument[]> {
    return this.model.find().exec();
  }

  async findById(id: string): Promise<EventDocument> {
    const doc = await this.model.findById(id).exec();
    if (!doc) throw new NotFoundException(`Event ${id} not found`);
    return doc;
  }

  async update(id: string, update: UpdateEventDto): Promise<EventDocument> {
    const updated = await this.model
      .findByIdAndUpdate(id, update, { new: true })
      .exec();
    if (!updated) throw new NotFoundException(`Event ${id} not found`);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const res = await this.model.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException(`Event ${id} not found`);
  }

  async findActiveByTypeAndPeriod(
    type: EventType,
    start: Date,
    end: Date,
  ): Promise<EventDocument[]> {
    return this.model
      .find({
        type,
        isActive: true,
        startAt: { $lte: end },
        endAt: { $gte: start },
      })
      .exec();
  }
}
