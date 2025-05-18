import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class UserLogin extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Date, default: Date.now, required: true })
  loginDate: Date;
}

export const UserLoginSchema = SchemaFactory.createForClass(UserLogin);

UserLoginSchema.index({ userId: 1, loginDate: 1 }, { unique: true });
