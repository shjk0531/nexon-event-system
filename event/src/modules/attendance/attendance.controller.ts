import { Controller, Post, Body } from "@nestjs/common";
import { AttendanceService } from "./attendance.service";
import { CreateAttendanceDto } from "./dto/CreateAttendanceDto";

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto.name, createAttendanceDto.startingDate, createAttendanceDto.endingDate, createAttendanceDto.location, createAttendanceDto.rewardList);
  }

}
