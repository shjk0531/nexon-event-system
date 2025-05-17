import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'refresh_tokens',
})
export class RefreshToken extends Document {
  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ required: true, default: false })
  isUsed: boolean;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
