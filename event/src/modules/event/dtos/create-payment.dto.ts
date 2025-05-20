import { IsEnum, IsNumber, IsPositive } from 'class-validator';
import { PaymentType } from '../schemas/payment.schema';

export class CreatePaymentDto {
  @IsEnum(PaymentType)
  type: PaymentType;

  @IsNumber()
  @IsPositive()
  amount: number;
} 