import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentDocument = Payment & Document;

/**
 * 결제 상태
 */
export enum PaymentStatus {
  /** 결제 대기 중 */
  PENDING   = 'PENDING',
  /** 결제 완료 */
  COMPLETED = 'COMPLETED',
  /** 결제 실패 */
  FAILED    = 'FAILED',
}

/**
 * 결제 유형
 */
export enum PaymentType {
  /** 일반 구매 결제 */
  PURCHASE = 'PURCHASE',
  /** 캐시백 트랜잭션 */
  CASHBACK = 'CASHBACK',
}

@Schema({ timestamps: true, collection: 'payments' })
export class Payment {
  /** 결제한 유저 */
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  /** 결제 종류 */
  @Prop({ required: true, enum: PaymentType })
  type: PaymentType;

  /** 결제 상태 */
  @Prop({ required: true, enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  /** 결제/캐시백 금액 */
  @Prop({ type: Number, required: true, min: 0 })
  amount: number;

  /** 생성 일시 */
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
