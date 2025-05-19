import {
    IsString,
    IsEnum,
    IsDateString,
    IsBoolean,
    IsOptional,
    IsObject,
  } from 'class-validator';
  import { EventType } from '../constants/event-type.constant';
  
  export class CreateEventDto {
    @IsString()
    name: string;
  
    @IsEnum(EventType)
    type: EventType;
  
    @IsDateString()
    startAt: string;
  
    @IsDateString()
    endAt: string;
  
    @IsBoolean()
    @IsOptional()
    isActive?: boolean = true;
  
    @IsObject()
    config: Record<string, any>;
  }
  