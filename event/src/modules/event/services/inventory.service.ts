import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Inventory, InventoryDocument } from '../schemas/inventory.schema';

/**
 * 사용자 인벤토리 관리 서비스
 * - 아이템 지급, 회수
 * - 사용자 인벤토리 조회
 */
@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name)
    private readonly inventoryModel: Model<InventoryDocument>,
  ) {}

  /**
   * 사용자에게 아이템을 추가합니다.
   */
  async addItem(
    userId: string,
    itemId: string,
    quantity: number,
  ): Promise<void> {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than zero');
    }

    const userObjectId = new Types.ObjectId(userId);
    const existing = await this.inventoryModel
      .findOne({ userId: userObjectId, itemId })
      .exec();

    if (existing) {
      existing.quantity += quantity;
      await existing.save();
    } else {
      await this.inventoryModel.create({
        userId: userObjectId,
        itemId,
        quantity,
      });
    }
  }

  /**
   * 사용자로부터 아이템을 제거합니다.
   */
  async removeItem(
    userId: string,
    itemId: string,
    quantity: number,
  ): Promise<void> {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than zero');
    }

    const userObjectId = new Types.ObjectId(userId);
    const existing = await this.inventoryModel
      .findOne({ userId: userObjectId, itemId })
      .exec();

    if (!existing || existing.quantity < quantity) {
      throw new BadRequestException('Insufficient item quantity');
    }

    existing.quantity -= quantity;
    if (existing.quantity === 0) {
      await this.inventoryModel.deleteOne({ _id: existing._id }).exec();
    } else {
      await existing.save();
    }
  }

  /**
   * 사용자 인벤토리 전체를 조회합니다.
   */
  async getInventory(
    userId: string,
  ): Promise<{ itemId: string; quantity: number }[]> {
    const userObjectId = new Types.ObjectId(userId);
    const docs = await this.inventoryModel
      .find({ userId: userObjectId })
      .exec();

    return docs.map((doc) => ({
      itemId: doc.itemId,
      quantity: doc.quantity,
    }));
  }

  /**
   * 특정 아이템의 수량을 조회합니다.
   */
  async getQuantity(
    userId: string,
    itemId: string,
  ): Promise<number> {
    const userObjectId = new Types.ObjectId(userId);
    const doc = await this.inventoryModel
      .findOne({ userId: userObjectId, itemId })
      .exec();

    return doc?.quantity ?? 0;
  }
}   