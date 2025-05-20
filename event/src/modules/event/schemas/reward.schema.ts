import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RewardType } from '../constants/reward-type.constant';

export type RewardDocument = Reward & Document;

@Schema({ timestamps: true, collection: 'rewards' })
export class Reward {
  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: Types.ObjectId;

  @Prop({ required: true, enum: RewardType })
  type: RewardType;

  @Prop({ type: Object, required: true })
  config: Record<string, any>;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
