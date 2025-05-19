import { IsString } from 'class-validator';

export class ClaimEventDto {
  @IsString()
  eventId: string;
}
