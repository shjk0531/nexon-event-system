import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PaymentDocument } from '../schemas/payment.schema';

/**
 * Payment 관련 비즈니스 로직을 처리
 * - 기간별 결제 합산 (SpendThresholdStrategy)
 * - 특정 시점 이후 결제 여부 (PaybackStrategy)
 * - 마지막 결제 정보 조회 (CashbackRewardStrategy)
 * - 캐시백 트랜잭션 생성
 */
@Injectable()
export class PaymentService {
  constructor(
    @InjectModel('Payment')
    private readonly paymentModel: Model<PaymentDocument>,
  ) {}

  /**
   * 주어진 기간(start ~ end) 동안 완료된 결제 총합
   */
  async getTotalSpent(
    userId: string,
    start: Date,
    end: Date,
  ): Promise<number> {
    const result = await this.paymentModel
      .aggregate([
        {
          $match: {
            userId: new Types.ObjectId(userId),
            status: 'COMPLETED',
            createdAt: { $gte: start, $lte: end },
          },
        },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ])
      .exec();

    return result[0]?.total ?? 0;
  }

  /**
   * 특정 시점(since) 이후에 완료된 결제가 있는지 여부
   */
  async hasPaymentSince(
    userId: string,
    since: Date,
  ): Promise<boolean> {
    const count = await this.paymentModel.countDocuments({
      userId: new Types.ObjectId(userId),
      status: 'COMPLETED',
      createdAt: { $gte: since },
    }).exec();
    return count > 0;
  }

  /**
   * 가장 최근에 완료된 결제 정보를 반환
   */
  async getLastPayment(
    userId: string,
  ): Promise<{ amount: number; createdAt: Date } | null> {
    const last = await this.paymentModel
      .findOne({
        userId: new Types.ObjectId(userId),
        status: 'COMPLETED',
      })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return last
      ? { amount: last.amount, createdAt: last.createdAt }
      : null;
  }

  /**
   * 지정된 금액만큼 캐시백 트랜잭션을 생성
   */
  async issueCashback(
    userId: string,
    amount: number,
  ): Promise<void> {
    await this.paymentModel.create({
      userId: new Types.ObjectId(userId),
      type: 'CASHBACK',
      status: 'COMPLETED',
      amount,
      createdAt: new Date(),
    });
  }
}
