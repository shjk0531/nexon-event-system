import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventAttendance, EventAttendanceSchema } from './schemas/event-attendance.schema';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EventAttendance.name, schema: EventAttendanceSchema },
    ]),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
