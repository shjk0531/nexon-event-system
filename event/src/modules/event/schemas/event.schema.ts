import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { EventType } from '../constants/event-type.constant';

export type EventDocument = Event & Document & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true, collection: 'events' })
export class Event {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: EventType })
  type: EventType;

  @Prop({ required: true })
  startAt: Date;

  @Prop({ required: true })
  endAt: Date;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Object, required: true })
  config: Record<string, any>;
}

export const EventSchema = SchemaFactory.createForClass(Event);
