import { IsString, IsNotEmpty } from "class-validator";

export class FindClaimUserDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  eventId: string;
}
