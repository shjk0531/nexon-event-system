import { InjectModel } from "@nestjs/mongoose";
import { EventAttendance } from "./schemas/event-attendance.schema";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(EventAttendance.name)
    private readonly eventAttendanceModel: Model<EventAttendance>,
  ) {}

  async create(name: string, startingDate: Date, endingDate: Date, location: string, rewardList: string[]): Promise<EventAttendance> {
    const eventAttendance = new this.eventAttendanceModel({ name, startingDate, endingDate, location, rewardList });
    return eventAttendance.save();
  }

  
}