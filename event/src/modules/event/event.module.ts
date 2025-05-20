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
import { ReferralCodeService } from "./services/referral-code.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PaymentController } from './controllers/payment.controller';

@Module({
    imports: [
      MongooseModule.forFeature([
        { name: 'Event', schema: EventSchema },
        { name: 'Reward', schema: RewardSchema },
        { name: 'Claim', schema: ClaimSchema },
        { name: 'Payment', schema: PaymentSchema },
        { name: 'Inventory', schema: InventorySchema },
      ]),
      JwtModule.registerAsync({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          secret: configService.get('jwt.secret'),
          signOptions: { expiresIn: configService.get('jwt.expiresIn') },
        }),
        inject: [ConfigService],
      }),
    ],
    controllers: [EventController, ClaimController, PaymentController],
    providers: [
      EventService,
      ConditionService,
      RewardService,
      ClaimService,
      PaymentService,
      InventoryService,
      ReferralCodeService,
      ...eventProviders,
    ],
    exports: [EventService, ClaimService],
  })
  export class EventModule {}