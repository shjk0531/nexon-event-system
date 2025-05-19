import { EventSchema } from "./schemas/event.schema";
import { RewardSchema } from "./schemas/reward.schema";
import { ClaimSchema } from "./schemas/claim.schema";
import { PaymentSchema } from "./schemas/payment.schema";
import { InventorySchema } from "./schemas/inventory.schema";
import { EventController } from "./controllers/event.controller";
import { ClaimController } from "./controllers/claim.controller";
import { EventService } from "./services/event.service";
import { ConditionService } from "./services/condition.service";
import { RewardService } from "./services/reward.service";
import { ClaimService } from "./services/claim.service";
import { PaymentService } from "./services/payment.service";
import { InventoryService } from "./services/inventory.service";
import { eventProviders } from "./event.providers";
import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";

@Module({
    imports: [
      MongooseModule.forFeature([
        { name: 'Event', schema: EventSchema },
        { name: 'Reward', schema: RewardSchema },
        { name: 'Claim', schema: ClaimSchema },
        { name: 'Payment', schema: PaymentSchema },
        { name: 'Inventory', schema: InventorySchema },
      ]),
    ],
    controllers: [EventController, ClaimController],
    providers: [
      EventService,
      ConditionService,
      RewardService,
      ClaimService,
      PaymentService,
      InventoryService,
      ...eventProviders,
    ],
    exports: [EventService, ClaimService],
  })
  export class EventModule {}