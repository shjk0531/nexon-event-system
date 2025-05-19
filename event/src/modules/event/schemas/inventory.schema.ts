import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InventoryDocument = Inventory & Document;

@Schema({ timestamps: true, collection: 'inventories' })
export class Inventory {
  /** 사용자 ID (참조) */
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  /** 아이템 고유 ID */
  @Prop({ type: String, required: true })
  itemId: string;

  /** 해당 아이템 수량 */
  @Prop({ type: Number, required: true, min: 0, default: 0 })
  quantity: number;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);

// userId + itemId 조합에 대해 유니크 인덱스 설정
InventorySchema.index({ userId: 1, itemId: 1 }, { unique: true });
