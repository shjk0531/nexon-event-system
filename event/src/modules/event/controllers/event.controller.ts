import { Controller, Delete, Get, Param, Patch, Post, Query, Body } from "@nestjs/common";
import { CurrentUser } from "common/decorators/current-user.decorator";
import { EventService } from "../services/event.service";
import { CreateEventDto } from "../dtos/create-event.dto";
import { UpdateEventDto } from "../dtos/update-event.dto";
import { CreateRewardDto } from "../dtos/create-reward.dto";

@Controller('events')
export class EventController {
    constructor(private readonly eventService: EventService) {}

    /**
     * 이벤트 캘린더 조회
     */
  @Get('calendar')
  async getCalendar(
    @Query('month') month: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.eventService.getCalendar(userId, month);
  }

  /**
   * 추천인 아이디 조회
   */
  @Get('referrerId')
  async getReferrerId(
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.eventService.getReferrerId(user.id);
  }

  /**
   * 이벤트 생성
   */
  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  /**
   * 이벤트 목록 조회
   */
  @Get()
  async findAll() {
    return this.eventService.findAll();
  }

  /**
   * 이벤트 상세 조회
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  /**
   * 이벤트 수정
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    console.log(updateEventDto);
    return this.eventService.update(id, updateEventDto);
  }

  /**
   * 이벤트 삭제
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.eventService.remove(id);
  }

  /**
   * 이벤트 보상 추가
   */
  @Post(':id/rewards')
  async addReward(
    @Param('id') eventId: string,
    @Body() createRewardDto: CreateRewardDto,
  ) {
    return this.eventService.addReward(eventId, createRewardDto);
  }

}