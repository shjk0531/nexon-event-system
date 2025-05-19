import { Controller, Get, Param, Post, Query, Body } from "@nestjs/common";
import { CurrentUser } from "common/decorators/current-user.decorator";
import { ClaimService } from "../services/claim.service";
import { ClaimEventDto } from "../dtos/claim-event.dto";
import { FilterClaimsDto } from "../dtos/filter-claims.dto";

@Controller('claims')
export class ClaimController {
  constructor(private readonly claimService: ClaimService) {}

  @Post()
  async create(
    @Body() claimEventDto: ClaimEventDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.claimService.create(userId, claimEventDto.eventId);
  }

  @Get(':eventId')
  async findOne(
    @Param('eventId') eventId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.claimService.findOneByUserAndEvent(userId, eventId);
  }

  @Get()
  async findAll(@Query() filterClaimsDto: FilterClaimsDto) {
    return this.claimService.findAll(filterClaimsDto);
  }
}