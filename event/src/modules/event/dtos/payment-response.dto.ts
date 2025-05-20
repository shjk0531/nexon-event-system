import { PaymentStatus, PaymentType } from '../schemas/payment.schema';

export class PaymentResponseDto {
  paymentId: string;
  userId: string;
  type: PaymentType;
  status: PaymentStatus;
  amount: number;
  createdAt: string;
} 