import {
    IsOptional,
    IsString,
    IsEnum,
    IsArray,
  } from 'class-validator';
  import { Transform } from 'class-transformer';
  import { ClaimStatus } from '../constants/claim-status.constant';
  
  export class FilterClaimsDto {
    @IsOptional()
    @IsString()
    eventId?: string;
  
    @IsOptional()
    @IsEnum(ClaimStatus, { each: true })
    @IsArray()
    @Transform(({ value }) =>
      Array.isArray(value) ? value : value.split(','),
    )
    status?: ClaimStatus[];
  }
  