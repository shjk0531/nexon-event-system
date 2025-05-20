import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ClaimStatus } from '../constants/claim-status.constant';

export type ClaimDocument = Claim & Document & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * 이벤트 보상 클레임 모델
 */
@Schema({ timestamps: true, collection: 'claims' })
export class Claim {
  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: ClaimStatus })
  status: ClaimStatus;

  @Prop({ required: true, default: () => new Date() })
  requestedAt: Date;

  @Prop()
  processedAt?: Date;

  @Prop({ type: Object })
  detail?: Record<string, any>;
}

export const ClaimSchema = SchemaFactory.createForClass(Claim);
