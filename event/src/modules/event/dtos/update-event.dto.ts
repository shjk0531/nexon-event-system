import {
    IsString,
    IsEnum,
    IsDateString,
    IsBoolean,
    IsOptional,
    IsObject,
  } from 'class-validator';
  import { EventType } from '../constants/event-type.constant';
  
  export class UpdateEventDto {
    @IsString()
    @IsOptional()
    name?: string;
  
    @IsEnum(EventType)
    @IsOptional()
    type?: EventType;
  
    @IsDateString()
    @IsOptional()
    startAt?: string;
  
    @IsDateString()
    @IsOptional()
    endAt?: string;
  
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
  
    @IsObject()
    @IsOptional()
    config?: Record<string, any>;
  }
  