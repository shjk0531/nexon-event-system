import { IsString, IsOptional, IsObject } from 'class-validator';

export class ClaimEventDto {
  @IsString()
  eventId: string;

  @IsOptional()
  @IsObject()
  payload?: Record<string, any>;
}
