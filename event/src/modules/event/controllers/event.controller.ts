import { Controller, Delete, Get, Param, Patch, Post, Query, Body } from "@nestjs/common";
import { CurrentUser } from "common/decorators/current-user.decorator";
import { EventService } from "../services/event.service";
import { CreateEventDto } from "../dtos/create-event.dto";
import { UpdateEventDto } from "../dtos/update-event.dto";
import { CreateRewardDto } from "../dtos/create-reward.dto";

@Controller('events')
export class EventController {
    constructor(private readonly eventService: EventService) {}

  @Get('calendar')
  async getCalendar(
    @Query('month') month: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.eventService.getCalendar(userId, month);
  }

  @Get('referrerId')
  async getReferrerId(
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.eventService.getReferrerId(user.id);
  }

  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Get()
  async findAll() {
    return this.eventService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    console.log(updateEventDto);
    return this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.eventService.remove(id);
  }

  @Post(':id/rewards')
  async addReward(
    @Param('id') eventId: string,
    @Body() createRewardDto: CreateRewardDto,
  ) {
    return this.eventService.addReward(eventId, createRewardDto);
  }

}