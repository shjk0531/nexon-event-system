import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InventoryDocument = Inventory & Document & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * 사용자 인벤토리 모델
 */
@Schema({ timestamps: true, collection: 'inventories' })
export class Inventory {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  itemId: string;

  @Prop({ type: Number, required: true, min: 0, default: 0 })
  quantity: number;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);

InventorySchema.index({ userId: 1, itemId: 1 }, { unique: true });
