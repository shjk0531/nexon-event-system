import { Controller, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { CreatePaymentDto } from '../dtos/create-payment.dto';
import { PaymentResponseDto } from '../dtos/payment-response.dto';
import { PaymentStatus } from '../schemas/payment.schema';
import { CurrentUser } from 'common/decorators/current-user.decorator';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /**
   * 새로운 결제 생성
   */
  @Post()
  async createPayment(
    @CurrentUser('id') userId: string,
    @Body() dto: CreatePaymentDto,
  ): Promise<PaymentResponseDto> {
    return this.paymentService.createPaymentWithResponse(userId, dto);
  }

  /**
   * 결제 상태 업데이트
   */
  @Put(':paymentId/status')
  async updatePaymentStatus(
    @Param('paymentId') paymentId: string,
    @Body('status') status: PaymentStatus,
  ): Promise<PaymentResponseDto> {
    return this.paymentService.updatePaymentStatusWithResponse(paymentId, status);
  }
} 